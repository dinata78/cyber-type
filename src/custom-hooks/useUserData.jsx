import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUserData(username) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const usernameRef = doc(db, "usernames", username);
      const usernameSnapshot = await getDoc(usernameRef);
      const userId = usernameSnapshot.data()?.uid || null;
      
      if (!userId) {
        setUserData({});
        return;
      }

      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data() || {};

      setUserData(userData);
    }

    getUserData();
  }, [username]);

  return { userData }
}