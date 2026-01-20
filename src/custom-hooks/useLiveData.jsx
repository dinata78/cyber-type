
export function useLiveData(targetWords, committedWords, typedWord, currentWordIndex, mistakesCount, timeElapsed ) {

  const getTypingSpeed = (committedWords, typedWord, timeElapsed) => {
    if (timeElapsed <= 0) return 0;

    const words = [...committedWords, typedWord].join(" ");

    const wordsTypedAdjusted = words.length / 5;
    const wpm = Math.round((wordsTypedAdjusted / timeElapsed) * 60 * 100) / 100;

    return wpm;
  }

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

  const liveWpm = getTypingSpeed(committedWords, typedWord, timeElapsed);
    
  const typedCharsCount = [...committedWords, typedWord].join(" ").length;

  const correctlyTypedCharsCount = [...committedWords, getPrefix(typedWord, targetWords[currentWordIndex])].join(" ").length;
  
  const liveAccuracy = 
    typedCharsCount === 0 ? 100
    : Math.floor((correctlyTypedCharsCount / (correctlyTypedCharsCount + mistakesCount) * 100) * 10) / 10;

  return { liveWpm, liveAccuracy };
}