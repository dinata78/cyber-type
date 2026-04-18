import styles from "./SoloPlay.module.css";
import { useEffect, useRef } from "react";
import { GameInput } from "../game-flow/GameInput/GameInput";
import { Quote } from "../quote/Quote/Quote";
import { RoomData } from "../game-flow/RoomData/RoomData";
import { QuoteLeaderboard } from "../game-flow/QuoteLeaderboard/QuoteLeadeboard";
import { useGameState } from "../../custom-hooks/useGameState";
import { useQuote } from "../../custom-hooks/useQuote";
import { useMistakes } from "../../custom-hooks/useMistakes";
import { useTypingLogic } from "../../custom-hooks/useTypingLogic";
import { useQuoteBest } from "../../custom-hooks/useQuoteBest";

export function SoloPlay() {
  const { gameState, setGameIdle, setGameRunning, setGameFinished } = useGameState();

  const { quote, isQuoteLoading, pickNewQuote } = useQuote();
  
  const { quoteBest } = useQuoteBest(quote.id);

  const targetWords = !isQuoteLoading ? quote.text.split(" ") : [];

  const { mistakes, incrementMistakes, resetMistakes } = useMistakes();

  const {
    committedWords,
    typedWord,
    clearWords,
    currentWordIndex,
    currentLetterIndex,
    handleInputChange,
  } =
    useTypingLogic(
      gameState,
      targetWords,
      incrementMistakes,
    );

  const roomDataRef = useRef(null);
  const gameInputRef = useRef(null);

  const focusGameInput = () => {
    gameInputRef.current?.focus();
  }

  const getIsTypedCorrect = () => {
    const typedLength = typedWord.length;
    const correctWord = targetWords[currentWordIndex];

    for (let i = 0; i < typedLength; i++) {
      if (typedWord[i] !== correctWord[i]) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        console.log("Ctrl + Enter detected.");
        roomDataRef.current?.handleNewGame();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const isLastWordTyped =
      committedWords.length === targetWords.length - 1 &&
      typedWord === targetWords[targetWords.length - 1];
    
    if (isLastWordTyped) {
      console.log("Done!");
      setGameFinished();
      console.log("Game state set to 'finished'");
    }

  }, [committedWords, typedWord]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <RoomData
            ref={roomDataRef}
            quoteId={quote.id}
            quoteOrigin={quote.origin}
            quoteDifficulty={quote.difficulty}
            gameState={gameState}
            targetWords={targetWords}
            committedWords={committedWords}
            typedWord={typedWord}
            currentWordIndex={currentWordIndex}
            mistakes={mistakes}
            clearWords={clearWords}
            resetMistakes={resetMistakes}
            setGameIdle={setGameIdle}
            setGameRunning={setGameRunning}
            focusGameInput={focusGameInput}
            pickNewQuote={pickNewQuote}
          />
        </div>

        <div className={styles.middle}>
          <Quote
            isQuoteLoading={isQuoteLoading}
            targetWords={targetWords}
            currentWordIndex={currentWordIndex}
            currentLetterIndex={currentLetterIndex}
            typedWord={typedWord}
            origin={!isQuoteLoading ? quote.origin : null}
            difficulty={!isQuoteLoading ? quote.difficulty : null}
          />

          <GameInput
            gameState={gameState}
            setGameRunning={setGameRunning}
            gameInputRef={gameInputRef}
            focusGameInput={focusGameInput}
            typedWord={typedWord}
            isTypedCorrect={getIsTypedCorrect()}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.right}>
          <QuoteLeaderboard
            bestScores={quoteBest}
          />
        </div>
      </div>      
    </div>
  )
}