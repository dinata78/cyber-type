import styles from "./MatchHistory.module.css";
import { Timestamp } from "firebase/firestore";
import { MatchScore } from "../MatchScore/MatchScore";

export function MatchHistory() {

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <span className={styles.number}>#</span>
        <span className={styles.quote}>Quote</span>
        <span className={styles.accuracy}>Accuracy</span>
        <span className={styles.speed}>WPM</span>
      </div>
      <div className={styles.scoreWrapper}>
        <MatchScore
          number={1}
          quote={"Crime and Punishment"}
          difficulty={"easy"}
          accuracy={97.2}
          speed={131.43}
          createdAt={Timestamp.fromDate(new Date("2026-03-30T11:17:40"))}
        />
        <MatchScore
          number={2}
          quote={"The Trial"}
          difficulty={"medium"}
          accuracy={100}
          speed={120}
          createdAt={Timestamp.fromDate(new Date("2024-07-12T10:20:40"))}
        />
        <MatchScore
          number={3}
          quote={"Animal Farm"}
          difficulty={"hard"}
          accuracy={99}
          speed={118.03}
          createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
        />
        <MatchScore
          number={4}
          quote={"Crime and Punishment"}
          difficulty={"easy"}
          accuracy={97.2}
          speed={131.43}
          createdAt={Timestamp.fromDate(new Date("2026-03-30T11:17:40"))}
        />
        <MatchScore
          number={5}
          quote={"The Trial"}
          difficulty={"medium"}
          accuracy={100}
          speed={120}
          createdAt={Timestamp.fromDate(new Date("2024-07-12T10:20:40"))}
        />
        <MatchScore
          number={6}
          quote={"Animal Farm"}
          difficulty={"hard"}
          accuracy={99}
          speed={118.03}
          createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
        />
        <MatchScore
          number={7}
          quote={"Crime and Punishment"}
          difficulty={"easy"}
          accuracy={97.2}
          speed={131.43}
          createdAt={Timestamp.fromDate(new Date("2026-03-30T11:17:40"))}
        />
        <MatchScore
          number={8}
          quote={"The Trial"}
          difficulty={"medium"}
          accuracy={100}
          speed={120}
          createdAt={Timestamp.fromDate(new Date("2024-07-12T10:20:40"))}
        />
        <MatchScore
          number={9}
          quote={"Animal Farm"}
          difficulty={"hard"}
          accuracy={99}
          speed={118.03}
          createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
        />
        <MatchScore
          number={10}
          quote={"Animal Farm"}
          difficulty={"hard"}
          accuracy={99}
          speed={118.03}
          createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
        />
      </div>
    </div>
  )
}