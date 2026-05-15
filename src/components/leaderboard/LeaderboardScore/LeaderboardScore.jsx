import styles from "./LeaderboardScore.module.css";
import { useNavigate } from "react-router-dom";
import { getTimePassed } from "../../../utils/getTimePassed";

export function LeaderboardScore({ number, playerName, createdAt, speed }) {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/user/${playerName.toLowerCase()}`);
  }

  return (
    <div className={styles.mainContainer}>
      <span className={styles.number}>{number}.</span>
      <div className={styles.player}>
        <span onClick={goToProfile}>{playerName}</span>
      </div>
      <span className={styles.date}>
        {getTimePassed(createdAt)} ago
      </span>
      <span className={styles.speed}>{speed}</span>
    </div>
  )
}