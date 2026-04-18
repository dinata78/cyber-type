import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export function useMatchAmount(username) {
  const [matchAmount, setMatchAmount] = useState(0);

  useEffect(() => {
    (async () => {
      if (!username) return;

      try {
        const docRef = doc(db, "matchHistory", username);

        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const meta = snapshot.data();

          const amount = (meta.latestPage - 1) * 25 + meta.countInLatest;

          setMatchAmount(amount);
        }
        else {
          setMatchAmount(0);
        }
      }
      catch (e) {
        console.error(e);
      }
    })();
  }, [username]);

  return { matchAmount }
}