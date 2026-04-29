import styles from "./MatchHistory.module.css";
import { MatchScore } from "../MatchScore/MatchScore";
import { useMatchScores } from "../../../custom-hooks/useMatchScores";
import { useEffect, useLayoutEffect, useRef } from "react";

export function MatchHistory({ username, currentPage, totalPage, goToPage, matchScores, matchOffset }) {

  const matchEndRef = useRef(null);
  const newestButtonRef = useRef(null);

  const sortedMatchScores = matchScores.toSorted((a, b) => a.createdAt - b.createdAt);

  useEffect(() => {
    if (
      totalPage !== 0
      && (currentPage <= 0 || currentPage > totalPage)
    ) {
      goToPage(totalPage, currentPage, totalPage);
    }
  }, [totalPage]);

  useEffect(() => {
    if (currentPage === totalPage) {
      matchEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [matchScores.length, currentPage, totalPage]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <span className={styles.number}>#</span>
        <span className={styles.quote}>Quote</span>
        <span className={styles.accuracy}>Accuracy</span>
        <span className={styles.speed}>WPM</span>
      </div>

      <div className={styles.scoreWrapper}>
        {
          sortedMatchScores.map((score, index) => {            
            return (
              <MatchScore
                key={score.createdAt - index}
                number={matchOffset + index + 1}
                quote={score.origin}
                difficulty={score.difficulty}
                accuracy={score.accuracy}
                speed={score.speed}
                createdAt={score.createdAt}
              />
            )
          })
        }

        <div ref={matchEndRef}></div>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.button}
          onClick={() => goToPage(1, currentPage, totalPage)}
        >
          OLDEST
        </button>

        <button
          className={`${styles.button} ${styles.arrow}`}
          onClick={() => goToPage(currentPage - 1, currentPage, totalPage)}
        >
          {"<<"}
        </button>

        <span className={styles.pageNumber}>
          {
            totalPage > 0 &&
            !(currentPage <= 0) &&
            !(currentPage > totalPage) &&
            <span>
              PAGE {currentPage} OF {totalPage}
            </span>            
          }
        </span>

        <button
          className={`${styles.button} ${styles.arrow}`}
          onClick={() => goToPage(currentPage + 1, currentPage, totalPage)}
        >
          {">>"}
        </button>

        <button
          ref={newestButtonRef}
          className={styles.button}
          onClick={() => goToPage(totalPage, currentPage, totalPage)}
        >
          NEWEST
        </button>
      </div>
    </div>
  )
}