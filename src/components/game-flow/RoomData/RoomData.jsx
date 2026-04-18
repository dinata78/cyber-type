import styles from "./RoomData.module.css";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../../../firebase";
import RoomStatus from "../RoomStatus/RoomStatus";
import RoomPlayers from "../RoomPlayers/RoomPlayers";
import { useAuth } from "../../../custom-hooks/useAuth";
import { useTimer } from "../../../custom-hooks/useTimer";
import { useLiveData } from "../../../custom-hooks/useLiveData";
import { useFinalData } from "../../../custom-hooks/useFinalData";

export const RoomData = forwardRef(({ quoteId, quoteOrigin, quoteDifficulty, gameState, targetWords, committedWords, typedWord, currentWordIndex, mistakes, clearWords, resetMistakes, setGameIdle, setGameRunning, focusGameInput, pickNewQuote }, ref) => {
  const { userRecord } = useAuth();

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

    const recomputedTimeElapsed = (Date.now() - startTime) / 1000;
    const recomputedWpm = getTypingSpeed(targetWords, committedWords, typedWord, currentWordIndex, recomputedTimeElapsed);
    const recomputedAccuracy = getAccuracy(targetWords, committedWords, typedWord, currentWordIndex, mistakes);

    stopTimer();
    console.log("Stopped timer.");
    resetStartTime();
    console.log("Reset start time.");
    storeFinalData(recomputedWpm, recomputedAccuracy, mistakes);
    console.log("Stored final datas.");
    clearWords();
    console.log("Cleared commited and typed word/s.");
    resetMistakes();
    console.log("Cleared mistakes count.");
    resetTimer();
    console.log("Cleared time elapsed.");

    (async () => {
      const recordMatchResult = httpsCallable(functions, "recordMatchResult");

      try {
        const result = await recordMatchResult({
          quoteId,
          quoteOrigin,
          quoteDifficulty,
          speed: recomputedWpm,
          accuracy: recomputedAccuracy,
          mistakes,
        });

        console.log(result.data);
      }
      catch (e) {
        console.error(e);
      }

      console.log("Ran recordMatchResult");
    })();

  }, [gameState]);
  
  return (
    <div className={styles.mainContainer}>
      <RoomStatus
        gameState={gameState}
        handleNewGame={handleNewGame}
        handleStartGame={handleStartGame}
      />
      <RoomPlayers
        playerName={userRecord?.displayName || "..."}
        wpm={gameState === "finished" ? finalWpm : liveWpm}
        accuracy={gameState === "finished" ? finalAccuracy : liveAccuracy}
        mistakesCount={gameState === "finished" ? finalMistakesCount : mistakes}
      />
    </div>
  )
});