import styles from "./MatchHistory.module.css";
import { useSearchParams } from "react-router-dom";
import { MatchScore } from "../MatchScore/MatchScore";
import { useMatchScores } from "../../../custom-hooks/useMatchScores";
import { useEffect, useRef } from "react";

export function MatchHistory({ username, totalPage }) {
  const [ searchParams, setSearchParams ] = useSearchParams();

  const matchEndRef = useRef(null);
  const hasScrolledToMatchEnd = useRef(false);

  const currentPage = Number(searchParams.get("matchPage"));

  const { matchScores, matchOffset } = useMatchScores(username, currentPage);

  const sortedMatchScores = matchScores.toSorted((a, b) => a.createdAt - b.createdAt);

  const goToPage = (newPage) => {
    if (
      newPage >= 1 
      && newPage <= totalPage 
      && newPage !== currentPage
    ) {
      setSearchParams({ matchPage: newPage });
    }
  }

  useEffect(() => {
    if (totalPage && !(searchParams.get("matchPage"))) {
      setSearchParams({ matchPage: totalPage }, { replace: true });
    }
  }, [totalPage, searchParams, setSearchParams]);

  useEffect(() => {
    if (
      matchScores.length > 0 
      && !hasScrolledToMatchEnd.current
    ) {
      matchEndRef.current?.scrollIntoView({ behavior: "smooth" });
      hasScrolledToMatchEnd.current = true;
    }
  }, [matchScores.length]);

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
          onClick={() => goToPage(1)}
        >
          OLDEST
        </button>

        <button
          className={`${styles.button} ${styles.arrow}`}
          onClick={() => goToPage(currentPage - 1)}
        >
          {"<<"}
        </button>

        <span className={styles.pageNumber}>
          PAGE {currentPage} OF {totalPage || 1}
        </span>

        <button
          className={`${styles.button} ${styles.arrow}`}
          onClick={() => goToPage(currentPage + 1)}
        >
          {">>"}
        </button>

        <button
          className={styles.button}
          onClick={() => goToPage(totalPage)}
        >
          NEWEST
        </button>
      </div>
    </div>
  )
}