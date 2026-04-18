import { doc, getDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { db } from "../../firebase";

export function useMatchScores(username, matchPage) {
  const [matchScores, setMatchScores] = useState([]);

  const matchOffset = (matchPage - 1) * 25; 

  const getMatchScores = async (username, matchPage) => {
    const docRef = doc(db, "matchHistory", username.toLowerCase(), "pages", `page-${matchPage}`);

    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const matchScores = snapshot.data()?.matchScores || [];

      setMatchScores(matchScores);
    }
    else {
      setMatchScores([]);
    }
  }

  useEffect(() => {
    try {
      getMatchScores(username, matchPage);
    }
    catch (error) {
      console.error(error);
    }

    return () => {
      setMatchScores([]);
    }
  }, [username, matchPage]);

  useLayoutEffect(() => {
    setMatchScores([]);
  }, [matchPage]);

  return { matchScores, matchOffset }
}