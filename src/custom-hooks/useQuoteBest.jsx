import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useQuoteBest(quoteId) {
  const [quoteBest, setQuoteBest] = useState([]);

  useEffect(() => {
    if (!quoteId) return;

    const docRef = doc(db, "quoteBest", quoteId);

    const unsubscribe = onSnapshot(docRef, snapshot => {
      if (snapshot.exists()) {
        const bestScores = snapshot.data()?.bestScores || [];

        setQuoteBest(bestScores);
      }
      else {
        setQuoteBest([]);
      }
    });

    return () => unsubscribe();

  }, [quoteId]);

  return { quoteBest };
}