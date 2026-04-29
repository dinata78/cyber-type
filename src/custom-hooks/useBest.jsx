import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useBest(username) {
  const [bestScores, setBestScores] = useState([]);
  const [bestSpeed, setBestSpeed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const resetBest = () => {
    setBestScores([]);
    setBestSpeed(0);
  }

  useEffect(() => {
    const getBest = async () => {
      if (!username) {
        resetBest();
        return;
      }

      setIsLoading(true);
      resetBest();

      try {
        const docRef = doc(db, "bestScores", username);

        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const bestScores = snapshot.data()?.bestScores || [];
          const bestSpeed = snapshot.data()?.bestSpeed || 0;

          setBestScores(bestScores);
          setBestSpeed(bestSpeed);
        }
        else {
          resetBest();
        }
      }
      catch (e) {
        resetBest();
        console.error(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    getBest();
  }, [username]);

  return {
    bestScores,
    bestSpeed,
    isBestLoading: isLoading,
  }
}