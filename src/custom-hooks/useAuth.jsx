import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [ userRecord, setUserRecord ] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userRecord) => {
      setUserRecord(userRecord);
    })

    return unsubscribe;
  }, []);

  const login = async (username, password) => {
    if (!username || !password) {
      return {
        ok: false,
        code: "EMPTY_FIELDS",
      }
    }

    if (username.length > 16) {
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

    try {
      const usernameKey = username.replaceAll(/\s+/g, " ").trim().toLowerCase();
      const usernamesDoc = await getDoc(doc(db, "usernames", usernameKey));

      if (!usernamesDoc.exists()) {
        return {
          ok: false,
          code: "USERNAME_NOT_FOUND",
        }
      }

      const uid = usernamesDoc.data().uid;
      const usersDoc = await getDoc(doc(db, "users", uid));

      if (!usersDoc.exists()) {
        return {
          ok: false,
          code: "INTERNAL_SERVER_ERROR",
        }
      }
      else {
        await signInWithEmailAndPassword(
          auth,
          usersDoc.data().email,
          password,
        );
        return {
          ok: true,
        }
      }
    }
    catch (error) {
      if (error.code === "auth/wrong-password") {
        return {
          ok: false,
          code: "WRONG_PASSWORD",
        }
      }
      else if (error.code === "auth/user-disabled") {
        return {
          ok: false,
          code: "USER_DISABLED",
        }
      }
      else if (error.code === "invalid-argument") {
        return {
          ok: false,
          code: "EMPTY_FIELDS",
        }
      }

      return {
        ok: false,
        code: "INTERNAL_SERVER_ERROR",
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
    }
    catch (error) {
      return {
        ok: false,
        code: "INTERNAL_SERVER_ERROR",
      }
    }

    return {
      ok: true,
    }
  }

  return {
    isAuthenticated: !!userRecord,
    userRecord,
    login,
    logout,
  }
}