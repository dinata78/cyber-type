import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useBestScores(quoteId) {
  const [bestScores, setBestScores] = useState([]);

  useEffect(() => {
    if (!quoteId) return;

    const collectionRef = collection(db, "leaderboard", quoteId, "scores");

    const unsubscribe = onSnapshot(collectionRef, snapshot => {
      if (snapshot.docs.length > 0) {
        let scores = [];
        snapshot.docs.forEach(doc => {
          scores.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        setBestScores(scores);
      }
      else {
        setBestScores([]);
      }
    });

    return () => unsubscribe();

  }, [quoteId]);

  return { bestScores };
}