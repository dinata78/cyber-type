
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
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
      error: "invalid-argument",
    }
  }

  // Normalize username
  const normalizedUsername = username.replaceAll(/\s+/g, " ").trim();

  if (normalizedUsername.length > 16) {
    return {
      ok: false,
      error: "invalid-username",
    }
  }

  if (password.length < 8 || password.length > 24) {
    return {
      ok: false,
      error: "invalid-password",
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
      error: "auth/username-already-exists",
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
    return {
      ok: false,
      error: error.code,
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
      error: "firestore-write-fails",
    }
  }
  
  return {
    ok: true,
  }
});