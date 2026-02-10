import styles from "./SoloPlay.module.css";
import { useEffect } from "react";
import { GameInput } from "../GameInput/GameInput";
import { useGameState } from "../../custom-hooks/useGameState";
import { useQuote } from "../../custom-hooks/useQuote";
import { useTimer } from "../../custom-hooks/useTimer";
import { useMistakes } from "../../custom-hooks/useMistakes";
import { useTypingLogic } from "../../custom-hooks/useTypingLogic";
import { useLiveData } from "../../custom-hooks/useLiveData";
import { useFinalData } from "../../custom-hooks/useFinalData";
import { Quote } from "../Quote/Quote";

export function SoloPlay() {
  const { gameState, gameIdle, gameRunning, gameFinished } = useGameState();

  const { text, origin, difficulty, pickNewQuote } = useQuote();

  const targetWords = text.split(" ");

  const { timeElapsed, resetTimer, stopTimer } = useTimer(gameState);

  const { getMistakes, incrementMistakes, resetMistakes } = useMistakes();

  const {
    committedWords,
    typedWord,
    clearCommitedWords,
    clearTypedWord,
    currentWordIndex,
    currentLetterIndex,
    handleInputChange,
  } =
    useTypingLogic(
      gameState,
      gameRunning,
      targetWords,
      incrementMistakes,
    );

  const { liveWpm, liveAccuracy } =
    useLiveData(
      targetWords,
      committedWords,
      typedWord,
      currentWordIndex,
      getMistakes(),
      timeElapsed,
    );

  const {
    finalWpm,
    finalAccuracy,
    setFinalWpm,
    setFinalAccuracy,
    clearFinalWpm,
    clearFinalAccuracy,
  } = useFinalData();

  const handleRestartClick = () => {
    clearFinalWpm();
    console.log("Cleared final WPM");
    clearFinalAccuracy();
    console.log("Cleared final accuracy.");
    pickNewQuote();
    console.log("Picked new quote.");
    gameIdle();
    console.log("Game state set to 'idle'");
  }

  useEffect(() => {
    if (gameState !== "finished") return;

    stopTimer();
    console.log("Stopped timer.")
    setFinalWpm(liveWpm);
    console.log("Stored final WPM.");
    setFinalAccuracy(liveAccuracy);
    console.log("Stored final accuracy.");
    clearCommitedWords();
    console.log("Cleared committed words.");
    clearTypedWord();
    console.log("Cleared typed word.");
    resetMistakes();
    console.log("Cleared mistakes count.");
    resetTimer();
    console.log("Cleared time elapsed.");
  }, [gameState]);

  useEffect(() => {
    const isLastWordTyped =
      committedWords.length === targetWords.length - 1 &&
      typedWord === targetWords[targetWords.length - 1];
    
    if (isLastWordTyped) {
      console.log("Done!");
      gameFinished();
      console.log("Game state set to 'finished'");
    }

  }, [committedWords, typedWord]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.middle}>
        <Quote
          targetWords={targetWords}
          currentWordIndex={currentWordIndex}
          currentLetterIndex={currentLetterIndex}
          typedWord={typedWord}
          origin={origin}
          difficulty={difficulty}
        />

        {
          gameState !== "finished" &&
          <GameInput
            typedWord={typedWord}
            onChange={handleInputChange}
            isDisabled={gameState === "finished"}
            pickNewQuote={pickNewQuote}
          />
        }
      </div>

      {
        gameState === "finished" &&
        <button
          className={styles.button}
          onClick={handleRestartClick}
        >
          Restart Test
        </button>
      }
    </div>
  )
}