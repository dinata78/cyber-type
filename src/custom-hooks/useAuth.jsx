import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userRecord) => {
      if (userRecord?.uid) {
        setIsAuthenticated(true);
      }
      else {
        setIsAuthenticated(false);
      }
    })

    return unsubscribe;
  }, []);

  const login = async (username, password) => {
    try {
      const usernameKey = username.replaceAll(/\s+/g, " ").trim().toLowerCase();
      const usernamesDoc = await getDoc(doc(db, "usernames", usernameKey));

      if (!usernamesDoc.exists()) {
        return {
          ok: false,
          error: "auth/username-not-found",
        }
      }

      const uid = usernamesDoc.data().uid;
      const usersDoc = await getDoc(doc(db, "users", uid));

      if (!usersDoc.exists()) {
        return {
          ok: false,
          error: "user-data-not-found",
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
      return {
        ok: false,
        error: error.code,
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
        error: error.code,
      }
    }

    return {
      ok: true,
    }
  }

  return {
    isAuthenticated,
    login,
    logout,
  }
}