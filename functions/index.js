
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