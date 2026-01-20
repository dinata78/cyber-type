import { useState } from "react";

export function useFinalData() {
  const [ finalWpm, setFinalWpm ] = useState(0);
  const [ finalAccuracy, setFinalAccuracy ] = useState(0);

  const clearFinalWpm = () => setFinalWpm(0);
  const clearFinalAccuracy = () => setFinalAccuracy(0);

  return {
    finalWpm,
    finalAccuracy,
    setFinalWpm,
    setFinalAccuracy,
    clearFinalWpm,
    clearFinalAccuracy,
  }
}