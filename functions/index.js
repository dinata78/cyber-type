
const { default: axios } = require("axios");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore, Timestamp} = require("firebase-admin/firestore");
const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const { runTransaction } = require("firebase/firestore");

const firebaseApiKey = "AIzaSyCUk7_Hao2fzi46IbQsITtbWFgT25vwwXg";

initializeApp();

setGlobalOptions({
  maxInstances: 10,
  region: "asia-northeast1",
});

exports.signup = onCall(async (request) => {
  const { email, username, password } = request.data;

  if (!email || !username || !password) {
    return {
      ok: false,
      code: "EMPTY_FIELDS",
    }
  }

  const isValidUsername = /^[A-Za-z0-9 ]+$/.test(username);

  if (!isValidUsername) {
    return {
      ok: false,
      code: "INVALID_USERNAME_FORMAT",
    }
  }

  // Normalize username
  const normalizedUsername = username.replaceAll(/\s+/g, " ").trim();

  if (normalizedUsername.length > 16) {
    return {
      ok: false,
      code: "INVALID_USERNAME_LENGTH",
    }
  }

  if (password.length < 8 || password.length > 64) {
    return {
      ok: false,
      code: "INVALID_PASSWORD_LENGTH",
    }

  }
  const usernameKey = normalizedUsername.toLowerCase();

  // Check whether username key exists
  const doc =
    await getFirestore()
    .collection("usernames")
    .doc(usernameKey)
    .get();

  if (doc.exists) {
    return {
      ok: false,
      code: "USERNAME_ALREADY_EXISTS",
    }
  }

  let userRecord;

  // Create Auth
  try {
    userRecord = await getAuth().createUser({
      email,
      displayName: normalizedUsername,
      password,
    });
  }
  catch (error) {
    if (error.code === "auth/email-already-exists") {
      return {
        ok: false,
        code: "EMAIL_ALREADY_EXISTS",
      }
    }
    return {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
    }
  }

  // Store user's data to Firestore
  try {
    const batch = getFirestore().batch();

    const userRef = getFirestore().collection("users").doc(userRecord.uid);
    const usernameRef = getFirestore().collection("usernames").doc(usernameKey);
    const emailRef = getFirestore().collection("emails").doc(userRecord.uid);

    // Store user's data
    batch.set(userRef,{
      uid: userRecord.uid,
      username: userRecord.displayName,
      bio: "",
    });

    // Map username key to uid 
    batch.set(usernameRef, { uid: userRecord.uid });

    // Store user's email
    batch.set(emailRef, { email: userRecord.email });

    await batch.commit();
  }
  catch (error) {
    // Delete user when Firestore write fails
    await getAuth().deleteUser(userRecord.uid);

    return {
      ok: false,
      code: "INTERNAL_SERVER_ERROR",
    }
  }
  
  return {
    ok: true,
  }
});

exports.getLoginToken = onCall(async (request) => {
  if (request.auth) return { ok: false, code: "ALREADY_LOGGED_IN" }

  const { username, password } = request.data;

  if (!username || !password) {
    return { ok: false, code: "EMPTY_FIELDS" }
  }

  const usernameKey = username.replaceAll(/\s+/g, " ").trim().toLowerCase();

  try {
    const usernameRef = getFirestore().collection("usernames").doc(usernameKey);
    const usernameSnapshot = await usernameRef.get();

    if (!usernameSnapshot.exists) {
      return { ok: false, code: "USERNAME_NOT_FOUND" }
    }

    const uid = usernameSnapshot.data().uid;

    const emailRef = getFirestore().collection("emails").doc(uid);
    const emailDoc = await emailRef.get();
    const email = emailDoc.data().email;

    const res = await axios.post(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
      email,
      password,
      returnSecureToken: true,
    });

    const localId = res.data.localId;

    const customToken = await getAuth().createCustomToken(localId);

    return { ok: true, loginToken: customToken }
  }
  catch (error) {
    const code = error.response?.data?.error?.message;

    if (code === "INVALID_PASSWORD") {
      return { ok: false, code: "WRONG_PASSWORD" }
    }
    else if (code === "USER_DISABLED") {
      return { ok: false, code: "USER_DISABLED" }
    }
    else return { ok: false, code: "INTERNAL_SERVER_ERROR" }
  }
});

exports.recordMatchResult = onCall(async (request) => {
  if (!request.auth) return { ok: false, code: "NOT_AUTHENTICATED" }

  const {
    quoteId,
    quoteOrigin,
    quoteDifficulty,
    speed,
    accuracy,
    mistakes,

  } = request.data;

  if (
    !quoteId
    || !quoteOrigin
    || !quoteDifficulty
    || !speed
    || !accuracy
    || mistakes === null
  ) {
    return { ok: false, code: "EMPTY_FIELDS" }
  }

  if (mistakes === 0 && accuracy !== 100) {
    return { ok: false, code: "INVALID_DATA" }
  }

  if (speed > 400) {
    return { ok: false, code: "TOO_FAST" }
  }

  const playerName = request.auth.token.name;
  const usernameKey = playerName.toLowerCase();

  // Declare References
  const quoteBestRef = getFirestore().collection("quoteBest").doc(quoteId);
  const matchHistoryRef = getFirestore().collection("matchHistory").doc(usernameKey);
  const measurementsRef = getFirestore().collection("measurements").doc(usernameKey);
  const bestScoresRef = getFirestore().collection("bestScores").doc(usernameKey);
  
  // Logic
  try {
    await getFirestore().runTransaction(async (tx) => {
      // Read Data
      const quoteBestSnapshot = await tx.get(quoteBestRef);
      const matchHistorySnapshot = await tx.get(matchHistoryRef);
      const measurementsSnapshot = await tx.get(measurementsRef);
      const bestScoresSnapshot = await tx.get(bestScoresRef);

      const historyMeta = matchHistorySnapshot.data() || { latestPage: 1, countInLatest: 0 };
      const latestPageRef = matchHistoryRef.collection("pages").doc(`page-${historyMeta.latestPage}`);

      const latestPageSnapshot = await tx.get(latestPageRef);

      // Declare Variables For New Data
      let newQuoteBest;
      let newBestScores;
      let newBestSpeed;
      let newMeasurements;
      let newMatchScores;
      let newHistoryMeta;
      
      // Compute New Quote Best
      const quoteBestData = quoteBestSnapshot.data();
      
      const quoteBest = quoteBestData?.bestScores || [];

      const newQuoteBestScore = {
        playerName,
        speed,
        createdAt: Timestamp.now(),
      }

      if (quoteBest.length >= 10) {
        newQuoteBest = quoteBest.slice(0, 10).toSorted((a, b) => b.speed - a.speed);

        const slowestData = newQuoteBest.pop();

        if (newQuoteBestScore.speed > slowestData.speed) {
          newQuoteBest.push(newQuoteBestScore);
        }
        else {
          newQuoteBest.push(slowestData);
        }
      }
      else {
        newQuoteBest = [...quoteBest];

        newQuoteBest.push(newQuoteBestScore);
      }

      // Compute New Best Scores and Speed
      const best = bestScoresSnapshot.data()
        || { bestScores: [], bestSpeed: 0 }

      const sortedBestScores = best.bestScores.toSorted((a, b) => b.speed - a.speed);

      const newScore = {
        origin: quoteOrigin,
        difficulty: quoteDifficulty,
        speed,
        createdAt: Timestamp.now(),
      }

      if (sortedBestScores.length >= 10) {
        newBestScores = [...sortedBestScores].slice(0, 10);

        const slowestData = newBestScores.pop();

        if (newScore.speed > slowestData.speed) {
          newBestScores.push(newScore);
        }
        else {
          newBestScores.push(slowestData);
        }
      }
      else {
        newBestScores = [...sortedBestScores];

        newBestScores.push(newScore);
      }

      const bestSpeed = best.bestSpeed;

      if (newScore.speed > bestSpeed) {
        newBestSpeed = newScore.speed;
      }
      else {
        newBestSpeed = bestSpeed;
      }

      // Compute New Measurements
      const measurements = measurementsSnapshot.data() ||
        {
          totalSpeed: 0,
          totalAccuracy: 0,
          totalMistakes: 0,
          last25SpeedArray: [],
          last25AccuracyArray: [],
          last25MistakesArray: [],
        }
      
      const newSpeedArray = [...measurements.last25SpeedArray];
      const newAccuracyArray = [...measurements.last25AccuracyArray];
      const newMistakesArray = [...measurements.last25MistakesArray];


      if (newSpeedArray.length >= 25) {
        newSpeedArray.shift();
      }

      if (newAccuracyArray.length >= 25) {
        newAccuracyArray.shift();
      }

      if (newMistakesArray.length >= 25) {
        newMistakesArray.shift();
      }

      newSpeedArray.push(speed);
      newMistakesArray.push(mistakes);
      newAccuracyArray.push(accuracy);

      newMeasurements = {
        totalSpeed: measurements.totalSpeed + speed,
        totalAccuracy: measurements.totalAccuracy + accuracy,
        totalMistakes: measurements.totalMistakes + mistakes,
        last25SpeedArray: [...newSpeedArray],
        last25AccuracyArray: [...newAccuracyArray],
        last25MistakesArray: [...newMistakesArray], 
      };

      // Compute New Match Scores
      const newMatch = {
        origin: quoteOrigin,
        difficulty: quoteDifficulty,
        speed,
        accuracy,
        createdAt: Timestamp.now(),
      };

      if (historyMeta.countInLatest < 25) {
        const latestPageData = latestPageSnapshot.data();

        const existingMatches = latestPageData?.matchScores || [];

        newMatchScores = [...existingMatches, newMatch];

        newHistoryMeta = {
          latestPage: historyMeta.latestPage,
          countInLatest: historyMeta.countInLatest + 1
        }
      }
      else {
        const nextPageNumber = historyMeta.latestPage + 1;

        newMatchScores = [newMatch];

        newHistoryMeta = {
          latestPage: nextPageNumber,
          countInLatest: 1,
        }
      }

      // Write Data To Firestore
      tx.set(quoteBestRef, { bestScores: newQuoteBest });

      tx.set(bestScoresRef, {
        bestScores: newBestScores,
        bestSpeed: newBestSpeed,
      });

      tx.set(measurementsRef, newMeasurements);

      const pageRef = matchHistoryRef.collection("pages").doc(`page-${newHistoryMeta.latestPage}`);

      tx.set(pageRef, { matchScores: newMatchScores });

      tx.set(matchHistoryRef, {
        latestPage: newHistoryMeta.latestPage,
        countInLatest: newHistoryMeta.countInLatest,
      });
    });
  }
  catch (e) {
    return { ok: false, code: "INTERNAL_SERVER_ERROR", error: e.message }
  }

  return { ok: true, code: "MATCH_RESULT_RECORDED" }
});