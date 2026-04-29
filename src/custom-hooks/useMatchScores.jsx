import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { useSearchParams } from "react-router-dom";

export function useMatchScores(username) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matchScores, setMatchScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentPage = Number(searchParams.get("matchPage"));
  const matchOffset = (currentPage - 1) * 25; 

  const goToPage = (newPage, currentPage, totalPage) => {
    if (
      newPage >= 1 
      && newPage <= totalPage 
      && newPage !== currentPage
    ) {
      setSearchParams({ matchPage: newPage });
    }
  }
  useEffect(() => {
    const getMatchScores = async () => {
      if (!username) {
        setMatchScores([]);
        return;
      }

      setIsLoading(true);
      setMatchScores([]);

      try {
        const docRef = doc(db, "matchHistory", username, "pages", `page-${currentPage}`);

        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const matchScores = snapshot.data()?.matchScores || [];

          setMatchScores(matchScores);
        }
        else {
          setMatchScores([]);
        }
      }
      catch (e) {
        setMatchScores([]);
        console.error(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    getMatchScores();
  }, [username, currentPage]);

  return {
    matchScores,
    matchOffset,
    currentPage,
    goToPage,
    isMatchScoresLoading: isLoading,
  }
}