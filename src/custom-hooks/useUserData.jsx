import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useUserData(username) {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      if (!username) {
        setUserData({});
        return;
      }

      setIsLoading(true);
      setUserData({});

      try {
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
      catch (e) {
        setUserData({});
        console.error(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    getUserData();
  }, [username]);

  return { userData, isUserDataLoading: isLoading }
}