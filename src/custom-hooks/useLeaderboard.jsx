import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useLeaderboard(difficulty) {
  const [ entries, setEntries ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const getEntries = async () => {
      if (!difficulty) {
        setEntries([]);
        return;
      }

      setIsLoading(true);
      setEntries([]);

      try {
        const leaderboardRef = doc(db, "leaderboard", difficulty);

        const snapshot = await getDoc(leaderboardRef);

        const entries = snapshot.data()?.scores || [];

        setEntries(entries);
      }
      catch (e) {
        setEntries([]);
        console.error(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    getEntries();
  }, [difficulty]);

  return {
    leaderboardEntries: entries,
    isLeaderboardLoading: isLoading,
  }
}