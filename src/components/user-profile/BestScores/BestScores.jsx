import styles from "./BestScores.module.css";
import { MatchScore } from "../MatchScore/MatchScore";

export function BestScores({ bestScores, isLoading }) {
  const sortedBestScores = bestScores.toSorted((a, b) => b.speed - a.speed);

  return (
    <div className={styles.mainContainer}>
      {
        !isLoading &&
        sortedBestScores.map((score, index) => {
          return (
            <MatchScore
              key={score.createdAt - index}
              type={"best"}
              number={index + 1}
              quote={score.origin}
              difficulty={score.difficulty}
              speed={score.speed}
              createdAt={score.createdAt}
            />
          )
        })
      }
    </div>
  )
}