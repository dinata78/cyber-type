import { useEffect, useState } from "react";

export function useLiveData(targetWords, committedWords, typedWord, currentWordIndex, mistakesCount, timeElapsed ) {
  const [ liveWpm, setLiveWpm ] = useState(0);
  const [ liveAccuracy, setLiveAccuracy ] = useState(0);

  const getPrefix = (a, b) => {
    if (typeof a !== "string" || typeof b !== "string") {
      return "";
    }

    let i = 0;
    while (
      i < a.length &&
      i < b.length &&
      a[i] === b[i]
    ) {
      i++;
    }

    return a.slice(0, i);
  }

  const getTypingSpeed = (targetWords, committedWords, typedWord, currentWordIndex, timeElapsed) => {
    if (timeElapsed <= 0) return 0;

    const words = [...committedWords, getPrefix(typedWord, targetWords[currentWordIndex])].join(" ");

    const wordsTypedAdjusted = words.length / 5;
    const wpm = Math.round((wordsTypedAdjusted / timeElapsed) * 60 * 100) / 100;

    return wpm;
  }

  const getAccuracy = (targetWords, committedWords, typedWord, currentWordIndex, mistakesCount) => {
    const typedCharsCount = [...committedWords, typedWord].join(" ").length;

    const correctlyTypedCharsCount = [...committedWords, getPrefix(typedWord, targetWords[currentWordIndex])].join(" ").length;
  
    const accuracy = 
      typedCharsCount === 0 ? 100
      : Math.floor((correctlyTypedCharsCount / (correctlyTypedCharsCount + mistakesCount) * 100) * 10) / 10;

    return accuracy;
  }

  useEffect(() => {
    const wpm = getTypingSpeed(targetWords, committedWords, typedWord, currentWordIndex, timeElapsed);
    setLiveWpm(wpm);
  }, [timeElapsed]);

  useEffect(() => {
  const accuracy = getAccuracy(targetWords, committedWords, typedWord, currentWordIndex, mistakesCount);

  setLiveAccuracy(accuracy);
  }, [timeElapsed]);
    
  return { liveWpm, liveAccuracy, getTypingSpeed, getAccuracy };
}