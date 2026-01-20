import { useState } from "react";

export function useTypingLogic(gameState, gameRunning, targetWords, incrementMistakes) {
  const [ committedWords, setCommittedWords ] = useState([]);
  const [ typedWord, setTypedWord ] = useState("");

  const clearCommitedWords = () => setCommittedWords([]);
  const clearTypedWord = () => setTypedWord("");

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

    if (gameState === "idle" && word.length === 1) {
      console.log("First letter typed.");
      gameRunning();
      console.log("Game state set to 'running'");
    }
  }

  return {
    committedWords,
    typedWord,
    clearCommitedWords,
    clearTypedWord,
    currentWordIndex,
    currentLetterIndex,
    handleInputChange,
  };
}