
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore, FieldValue} = require("firebase-admin/firestore");
const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");

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

    // Store user's data
    batch.set(
      getFirestore().collection("users").doc(userRecord.uid),
      {
        uid: userRecord.uid,
        email: userRecord.email,
        username: userRecord.displayName,
      }
    );

    // Map username key to uid 
    batch.set(
      getFirestore().collection("usernames").doc(usernameKey),
      {
        uid: userRecord.uid,
      }
    );

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

exports.updateQuoteScores = onCall(async (request) => {
  if (!request.auth) return { ok: false, code: "NOT_AUTHENTICATED"};

  const { quoteId, speed } = request.data;
  const playerName = request.auth.token.name;

  if (!quoteId || !speed) {
    return { ok: false, code: "EMPTY_FIELDS" }
  }

  if (speed > 400) {
    return { ok: false, code: "TOO_FAST" }
  }

  try {
    const batch = getFirestore().batch();

    const collectionRef = getFirestore().collection("leaderboard").doc(quoteId).collection("scores");

    // Check if scores count exceeded the max amount

    const snapshot = await collectionRef.count().get();
    const count = snapshot.data().count;

    if (count >= 10) {
      const q = collectionRef.orderBy("speed", "asc").limit(1);
      const querySnapshot = await q.get();

      const slowestData = querySnapshot.docs[0].data();

      if (speed > slowestData.speed) {
        batch.delete(querySnapshot.docs[0].ref);
      }
      else {
        return { ok: true, code: "TOO_SLOW" }
      }
    }

    const docRef = collectionRef.doc();

    batch.create(docRef, {
      playerName,
      speed,
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
  }
  catch (error) {
    return { ok: false, code: "INTERNAL_SERVER_ERROR" }
  }

  return { ok: true, code: "NEW_SCORE_STORED" };
});