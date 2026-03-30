import styles from "./PlayerScore.module.css";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { getTimePassed } from "../../../utils/getTimePassed";

export default memo(function PlayerScore({ rank, playerName, speed, createdAt}) {

  const navigate = useNavigate();

  const timePassed = getTimePassed(createdAt);

  const onPlayerNameClick = () => {
    navigate(`/user/${playerName}`);
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.rank}>
        {rank}.
      </div>
      <div className={styles.name}>
        <span
          className={styles.playerName}
          onClick={onPlayerNameClick}
        >
          {playerName}
        </span>
        <span className={styles.date}>
          {timePassed} ago
        </span>
      </div>
      <div className={styles.speed}>
        <span>{speed}</span>
        <span>WPM</span>
      </div>
    </div>
  )
});