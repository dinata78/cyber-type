
const { default: axios } = require("axios");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore, Timestamp} = require("firebase-admin/firestore");
const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const { runTransaction } = require("firebase/firestore");
const { onDocumentWritten } = require("firebase-functions/firestore");

const firebaseApiKey = "AIzaSyCUk7_Hao2fzi46IbQsITtbWFgT25vwwXg";

initializeApp();

setGlobalOptions({
  maxInstances: 10,
  region: "asia-northeast1",
});

const db = getFirestore();

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
    await db
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
    const batch = db.batch();

    const userRef = db.collection("users").doc(userRecord.uid);
    const usernameRef = db.collection("usernames").doc(usernameKey);
    const emailRef = db.collection("emails").doc(userRecord.uid);

    // Store user's data
    batch.set(userRef,{
      uid: userRecord.uid,
      username: userRecord.displayName,
      bio: "",
      imageUrl: "",
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
    const usernameRef = db.collection("usernames").doc(usernameKey);
    const usernameSnapshot = await usernameRef.get();

    if (!usernameSnapshot.exists) {
      return { ok: false, code: "USERNAME_NOT_FOUND" }
    }

    const uid = usernameSnapshot.data().uid;

    const emailRef = db.collection("emails").doc(uid);
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
    || !Number.isInteger(mistakes)
  ) {
    return { ok: false, code: "EMPTY_FIELDS" }
  }

  if (
    typeof speed !== "number"
    || speed <= 0
    || speed > 400
  ) {
    return { ok: false, code: "INVALID_DATA" }
  }

  if (
    typeof accuracy !== "number"
    || accuracy <= 0
    || accuracy > 100
  ) {
    return { ok: false, code: "INVALID_DATA" }
  }

  if (
    typeof mistakes !== "number"
    || mistakes < 0 
  ) {
    return { ok: false, code: "INVALID_DATA" }
  }

  if (
    accuracy === 100 && mistakes > 0
    || accuracy !== 100 && mistakes === 0
  ) {
    return { ok: false, code: "INVALID_DATA" }
  }

  const playerName = request.auth.token.name;
  const usernameKey = playerName.toLowerCase();

  // Declare References
  const quoteBestRef = db.collection("quoteBest").doc(quoteId);
  const bestScoresRef = db.collection("bestScores").doc(usernameKey);
  const bestSpeedsRef = db.collection("bestSpeeds").doc(usernameKey);
  const measurementsRef = db.collection("measurements").doc(usernameKey);
  const matchHistoryRef = db.collection("matchHistory").doc(usernameKey);
  
  // Logic
  try {
    await db.runTransaction(async (tx) => {
      // Read Data
      const quoteBestSnapshot = await tx.get(quoteBestRef);
      const bestScoresSnapshot = await tx.get(bestScoresRef);
      const bestSpeedsSnapshot = await tx.get(bestSpeedsRef);
      const measurementsSnapshot = await tx.get(measurementsRef);
      const matchHistorySnapshot = await tx.get(matchHistoryRef);

      const historyMeta = matchHistorySnapshot.data() || { latestPage: 1, countInLatest: 0 };
      const latestPageRef = matchHistoryRef.collection("pages").doc(`page-${historyMeta.latestPage}`);

      const latestPageSnapshot = await tx.get(latestPageRef);

      // Declare Variables For New Data
      let newQuoteBest;
      let newBestScores;
      let newBestSpeed;
      let newBestSpeeds;
      let newMeasurements;
      let newMatchScores;
      let newHistoryMeta;
      
      // Compute New Quote Best
      const quoteBestData = quoteBestSnapshot.data();
      
      const quoteBest = quoteBestData?.scores || [];

      const newQuoteBestScore = {
        playerName,
        speed,
        createdAt: Timestamp.now(),
      }

      newQuoteBest = [...quoteBest, newQuoteBestScore]
        .toSorted((a, b) => b.speed - a.speed)
        .slice(0, 10);

      // Compute New Best Scores and Best Speed
      const best = bestScoresSnapshot.data()
        || { scores: [], bestSpeed: 0 }

      const bestScores = best.scores;
      const bestSpeed = best.bestSpeed;

      const newBestScore = {
        origin: quoteOrigin,
        difficulty: quoteDifficulty,
        speed,
        createdAt: Timestamp.now(),
      }

      newBestScores = [...bestScores, newBestScore]
        .toSorted((a, b) => b.speed - a.speed)
        .slice(0, 10);

      newBestSpeed = speed > best.bestSpeed ? speed : best.bestSpeed;

      // Compute New Best Speed For Each Difficulty
      const bestSpeeds = bestSpeedsSnapshot.data()
        ||  {
              playerName,
              speed: { All: 0, Easy: 0, Medium: 0, Hard: 0 }
            }
      
      const allDiffSpeed = bestSpeeds.speed["All"] || 0;
      const currentDiffSpeed = bestSpeeds.speed[quoteDifficulty] || 0;

      newBestSpeeds = structuredClone(bestSpeeds);

      if (speed > allDiffSpeed) {
        newBestSpeeds.speed["All"] = speed;
      }

      if (speed > currentDiffSpeed) {
        newBestSpeeds.speed[quoteDifficulty] = speed;
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
      
      const newSpeedArray = [...measurements.last25SpeedArray, speed];
      const newAccuracyArray = [...measurements.last25AccuracyArray, accuracy];
      const newMistakesArray = [...measurements.last25MistakesArray, mistakes];

      if (newSpeedArray.length >  25) newSpeedArray.shift();
      if (newAccuracyArray.length > 25) newAccuracyArray.shift();
      if (newMistakesArray.length > 25) newMistakesArray.shift();

      newMeasurements = {
        totalSpeed: measurements.totalSpeed + speed,
        totalAccuracy: measurements.totalAccuracy + accuracy,
        totalMistakes: measurements.totalMistakes + mistakes,
        last25SpeedArray: [...newSpeedArray],
        last25AccuracyArray: [...newAccuracyArray],
        last25MistakesArray: [...newMistakesArray], 
      };

      // Compute New Match Scores
      const newMatchScore = {
        origin: quoteOrigin,
        difficulty: quoteDifficulty,
        speed,
        accuracy,
        createdAt: Timestamp.now(),
      };

      if (historyMeta.countInLatest < 25) {
        const latestPageData = latestPageSnapshot.data();

        const existingMatches = latestPageData?.scores || [];

        newMatchScores = [...existingMatches, newMatchScore];

        newHistoryMeta = {
          latestPage: historyMeta.latestPage,
          countInLatest: historyMeta.countInLatest + 1
        }
      }
      else {
        const nextPageNumber = historyMeta.latestPage + 1;

        newMatchScores = [newMatchScore];

        newHistoryMeta = {
          latestPage: nextPageNumber,
          countInLatest: 1,
        }
      }

      // Write Data To Firestore
      tx.set(quoteBestRef, { scores: newQuoteBest });

      tx.set(bestScoresRef, {
        scores: newBestScores,
        bestSpeed: newBestSpeed,
      });

      if (speed > allDiffSpeed || speed > currentDiffSpeed) {
        tx.set(bestSpeedsRef, newBestSpeeds);
      }

      tx.set(measurementsRef, newMeasurements);

      const pageRef = matchHistoryRef.collection("pages").doc(`page-${newHistoryMeta.latestPage}`);

      tx.set(pageRef, { scores: newMatchScores });

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

const updateLeaderboard = async (playerName, difficulties, speed) => {
  const leaderboardRef = db.collection("leaderboard").doc(difficulties.toLowerCase());

  await db.runTransaction(async (tx) => {
    const leaderboardSnapshot = await tx.get(leaderboardRef);
    const leaderboardEntries = leaderboardSnapshot.data()?.scores || [];

    const filteredEntries = leaderboardEntries.filter(i => i.playerName !== playerName);
    const isNotFastEnough = filteredEntries.length >= 100 && speed < filteredEntries[99].speed;

    if (isNotFastEnough) return;

    const newLeaderboardEntries =
      [
        ...filteredEntries,
        { playerName, speed, createdAt: Timestamp.now() }
      ]
      .toSorted((a, b) => b.speed - a.speed)
      .slice(0, 100);

    tx.set(leaderboardRef, { scores: newLeaderboardEntries });
  });
}

exports.onBestSpeedsChange = onDocumentWritten("bestSpeeds/{usernameKey}", async (event) => {
  const bestSpeeds = event.data.after.data()?.speed;

  const previousSpeeds = event.data.before.data()?.speed
    ||  { All: 0, Easy: 0, Medium: 0, Hard: 0 }

  if (!bestSpeeds) return;

  const playerName = event.data.after.data().playerName;
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  await Promise.all(
    difficulties
      .filter(diff => bestSpeeds[diff] > previousSpeeds[diff])
      .map(diff => updateLeaderboard(playerName, diff, bestSpeeds[diff]))
  );
});