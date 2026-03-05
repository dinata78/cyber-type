import { useState } from "react";

export function useFinalData() {
  const [ finalWpm, setFinalWpm ] = useState(0);
  const [ finalAccuracy, setFinalAccuracy ] = useState(0);
  const [ finalMistakesCount, setFinalMistakesCount ] = useState(0);

  const storeFinalData = (wpm, accuracy, mistakesCount) => {
    setFinalWpm(wpm);
    setFinalAccuracy(accuracy);
    setFinalMistakesCount(mistakesCount);
  }

  const clearFinalData = () => {
    setFinalWpm(0);
    setFinalAccuracy(0);
    setFinalMistakesCount(0);
  }

  return {
    finalWpm,
    finalAccuracy,
    finalMistakesCount,
    storeFinalData,
    clearFinalData,
  }
}