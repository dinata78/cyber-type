import styles from "./RoomData.module.css";
import RoomStatus from "../RoomStatus/RoomStatus";
import RoomPlayers from "../RoomPlayers/RoomPlayers";
import { useTimer } from "../../custom-hooks/useTimer";
import { useLiveData } from "../../custom-hooks/useLiveData";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useFinalData } from "../../custom-hooks/useFinalData";

export const RoomData = forwardRef(({ gameState, targetWords, committedWords, typedWord, currentWordIndex, mistakes, clearWords, resetMistakes, setGameIdle, setGameRunning, focusGameInput, pickNewQuote }, ref) => {
  const {
    startTime,
    timeElapsed,
    resetStartTime,
    resetTimer,
    stopTimer
  } = useTimer(gameState);

  const {
    finalWpm,
    finalAccuracy,
    finalMistakesCount,
    storeFinalData,
    clearFinalData,
  } = useFinalData();

  const { liveWpm, liveAccuracy, getTypingSpeed, getAccuracy } =
    useLiveData(
      targetWords,
      committedWords,
      typedWord,
      currentWordIndex,
      mistakes,
      timeElapsed,
    );

  const handleNewGame = () => {
    stopTimer();
    resetTimer();
    clearWords();
    clearFinalData();
    resetMistakes();
    pickNewQuote();
    setGameIdle();
    focusGameInput();
  }

  const handleStartGame = () => {
    setGameRunning();
    focusGameInput();
    console.log("Set gameState to 'running'");
  }

  useImperativeHandle(ref, () => ({
    handleNewGame,
  }), []);

  useEffect(() => {
    if (gameState !== "finished") return;

    const finalTimeElapsed = (Date.now() - startTime) / 1000;

    const finalWpm = getTypingSpeed(targetWords, committedWords, typedWord, currentWordIndex, finalTimeElapsed);
    
    const finalAccuracy = getAccuracy(targetWords, committedWords, typedWord, currentWordIndex, mistakes);

    stopTimer();
    console.log("Stopped timer.");
    storeFinalData(finalWpm, finalAccuracy, mistakes);
    console.log("Stored final datas.");
    clearWords();
    console.log("Cleared commited and typed word/s.");
    resetMistakes();
    console.log("Cleared mistakes count.");
    resetTimer();
    console.log("Cleared time elapsed.");
  }, [gameState]);
  
  return (
    <div className={styles.mainContainer}>
      <RoomStatus
        gameState={gameState}
        handleNewGame={handleNewGame}
        handleStartGame={handleStartGame}
      />
      <RoomPlayers
        wpm={gameState === "finished" ? finalWpm : liveWpm}
        accuracy={gameState === "finished" ? finalAccuracy : liveAccuracy}
        mistakesCount={gameState === "finished" ? finalMistakesCount : mistakes}
      />
    </div>
  )
});