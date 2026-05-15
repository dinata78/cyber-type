import styles from "./QuoteLeaderboard.module.css"
import PlayerScore from "../PlayerScore/PlayerScore"

export function QuoteLeaderboard({ quoteBest }) {
  const sortedQuoteBest = quoteBest.toSorted((a, b) => b.speed - a.speed);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>BEST SCORES</div>
      <div className={styles.scores}>
        {
          sortedQuoteBest.map((data, index) => {
            return (
              <PlayerScore
                key={data.createdAt - index}
                rank={index + 1}
                playerName={data.playerName}
                speed={data.speed}
                createdAt={data.createdAt}
              />
            )
          })
        }
      </div>
    </div>
  )
}