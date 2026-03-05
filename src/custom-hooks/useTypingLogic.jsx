import { useState } from "react";

export function useTypingLogic(gameState, targetWords, incrementMistakes) {
  const [ committedWords, setCommittedWords ] = useState([]);
  const [ typedWord, setTypedWord ] = useState("");

  const clearWords = () => {
    setCommittedWords([]);
    setTypedWord("");
  }

  const currentWordIndex = committedWords.length;
  const currentLetterIndex = typedWord.length;

  const handleInputChange = (e) => {
    const value = e.target.value;
    const word = value.trim();

    if (
      gameState === "finished" ||
      word.length > targetWords[currentWordIndex].length
    ) return;

    if (value.endsWith(" ")) {
      if (word === targetWords[currentWordIndex]) {
        setCommittedWords(prev => [...prev, word]);
        setTypedWord("");
      }
    }
    else {
      setTypedWord(value);

      if (e.nativeEvent.inputType.startsWith("delete")) {
        return;
      }

      const lastTypedIndex = word.length - 1; 

      if (word[word.length - 1] !== targetWords[currentWordIndex][lastTypedIndex]) {
        incrementMistakes();
        console.log("mistake +1");
      }
    }
  }

  return {
    committedWords,
    typedWord,
    clearWords,
    currentWordIndex,
    currentLetterIndex,
    handleInputChange,
  };
} 