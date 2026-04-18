import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useBest(username) {
  const [bestScores, setBestScores] = useState([]);
  const [bestSpeed, setBestSpeed] = useState(0);

  useEffect(() => {
    if (!username) {
      setBestScores([]);
      setBestSpeed(0);
      return;
    }

    (async () => {
      const docRef = doc(db, "bestScores", username);

      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const bestScores = snapshot.data()?.bestScores || [];
        const bestSpeed = snapshot.data()?.bestSpeed || 0;

        setBestScores(bestScores);
        setBestSpeed(bestSpeed);
      }
      else {
        setBestScores(bestScores);
        setBestSpeed(bestSpeed);        
      }
    })();
  }, [username]);

  return { bestScores, bestSpeed }
}