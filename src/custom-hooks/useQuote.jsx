import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export function useQuote() {
  const [quote, setQuote] = useState({});
  const [isQuoteLoading, setIsQuoteLoading] = useState(true); 

  const pickNewQuote = async () => {
    setIsQuoteLoading(true);

    const randomDifficulty = (() => {
      const randomIndex = Math.floor(Math.random() * 3);
      
      if (randomIndex === 0) return "easy";
      else if (randomIndex === 1) return "medium";
      else return "hard";
    })();

    const randomQuoteIndex = Math.floor(Math.random() * 5) + 1;
    const lookupId = `${randomDifficulty}-${String(randomQuoteIndex).padStart(3, "0")}`;

    try {
      const docRef = doc(db, "quotes", lookupId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setQuote({
          ...snapshot.data(),
          id: snapshot.id,
        });
      }
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setIsQuoteLoading(false);
    }
  };

  useEffect(() => {
    pickNewQuote();
  }, []);

  return {
    quote,
    isQuoteLoading,
    pickNewQuote,
  };
}