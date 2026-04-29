import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuth() {
  const [ userRecord, setUserRecord ] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userRecord) => {
      setUserRecord(userRecord);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    }
    catch (error) {
      return { ok: false, code: "INTERNAL_SERVER_ERROR" }
    }

    return { ok: true, code: "LOGOUT_SUCCESS" }
  }

  return {
    isAuthenticated: !!userRecord,
    userRecord,
    logout,
  }
}