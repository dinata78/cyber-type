import styles from "./Leaderboard.module.css";
import { useEffect, useState } from "react";
import { LeaderboardScore } from "../LeaderboardScore/LeaderboardScore";
import { useLeaderboard } from "../../../custom-hooks/useLeaderboard";

export function Leaderboard() {
  const [ quoteDiff, setQuoteDiff ] = useState("all");

  const { leaderboardEntries, isLeaderboardLoading } = useLeaderboard(quoteDiff);

  const sortedEntries = leaderboardEntries.toSorted((a, b) => b.speed - a.speed);

  const getBtnClass = (btnDiff, quoteDiff) => {
    let btnClass = `${styles.btn}`;
  
    if (btnDiff === quoteDiff) btnClass += ` ${styles.current}`;

    return btnClass;
  }
  
  useEffect(() => {
    console.log(leaderboardEntries)
  }, [leaderboardEntries])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.wrapper}>
        <div className={styles.difficulties}>
          <button
            className={getBtnClass("all", quoteDiff)}
            onClick={() => setQuoteDiff("all")}
          >
            ALL
          </button>
          <button
            className={getBtnClass("easy", quoteDiff)}
            onClick={() => setQuoteDiff("easy")}
          >
            EASY
          </button>
          <button
            className={getBtnClass("medium", quoteDiff)}
            onClick={() => setQuoteDiff("medium")}
          >
            MEDIUM
          </button>
          <button
            className={getBtnClass("hard", quoteDiff)}
            onClick={() => setQuoteDiff("hard")}
          >
            HARD
          </button>
        </div>
        
        <div className={styles.header}>
          <span className={styles.number}>#</span>
          <span className={styles.player}>Player</span>
          <span className={styles.date}>Date</span>
          <span className={styles.speed}>WPM</span>
        </div>

        <div className={styles.scoreWrapper}>
          {
            !isLeaderboardLoading &&
            sortedEntries.map((item, index) => {
              return (
                <LeaderboardScore
                  key={item.playerName}
                  number={index + 1}
                  playerName={item.playerName}
                  createdAt={item.createdAt}
                  speed={item.speed}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}