import styles from "./PlayerScore.module.css";

const getTimePassed = (date) => {
  const currentDate = new Date();
  const timeDifference = currentDate - date;
  const seconds = Math.floor(timeDifference / 1000);

  if (seconds >= 86400) {
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? "day" : "days"}`;
  }  
  else if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }
  else if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
  } 
  else {
    return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  }
};

export function PlayerScore({ rank, playerName, speed, createdAt}) {
  const timePassed = getTimePassed(createdAt);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.rank}>
        {rank}.
      </div>
      <div className={styles.name}>
        <span>{playerName}</span>
        <span className={styles.date}>{timePassed} ago</span>
      </div>
      <div className={styles.speed}>
        <span>{speed}</span>
        <span>WPM</span>
      </div>
    </div>
  )
}