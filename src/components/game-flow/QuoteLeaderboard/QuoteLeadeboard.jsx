import styles from "./QuoteLeaderboard.module.css"
import PlayerScore from "../PlayerScore/PlayerScore"

export function QuoteLeaderboard({ bestScores }) {
  const sortedData = bestScores.toSorted((a, b) => b.speed - a.speed);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>BEST SCORES</div>
      <div className={styles.scores}>
        {
          sortedData.map((data, index) => {
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