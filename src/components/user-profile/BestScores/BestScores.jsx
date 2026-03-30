import styles from "./BestScores.module.css";
import { Timestamp } from "firebase/firestore";
import { MatchScore } from "../MatchScore/MatchScore";

export function BestScores() {

  return (
    <div className={styles.mainContainer}>
      <MatchScore
        type={"best"}
        number={1}
        quote={"Crime and Punishment"}
        difficulty={"easy"}
        accuracy={97.2}
        speed={131.43}
        createdAt={Timestamp.fromDate(new Date("2026-03-30T11:17:40"))}
      />
      <MatchScore
        type={"best"}
        number={2}
        quote={"The Trial"}
        difficulty={"medium"}
        accuracy={100}
        speed={120}
        createdAt={Timestamp.fromDate(new Date("2024-07-12T10:20:40"))}
      />
      <MatchScore
        type={"best"}
        number={3}
        quote={"Animal Farm"}
        difficulty={"hard"}
        accuracy={99}
        speed={118.03}
        createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
      />
      <MatchScore
        type={"best"}
        number={4}
        quote={"Crime and Punishment"}
        difficulty={"easy"}
        accuracy={97.2}
        speed={101.4}
        createdAt={Timestamp.fromDate(new Date("2026-03-30T11:17:40"))}
      />
      <MatchScore
        type={"best"}
        number={5}
        quote={"The Trial"}
        difficulty={"medium"}
        accuracy={100}
        speed={97.2}
        createdAt={Timestamp.fromDate(new Date("2024-07-12T10:20:40"))}
      />
      <MatchScore
        type={"best"}
        number={6}
        quote={"Animal Farm"}
        difficulty={"hard"}
        accuracy={99}
        speed={95.03}
        createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
      />
      <MatchScore
        type={"best"}
        number={7}
        quote={"Crime and Punishment"}
        difficulty={"easy"}
        accuracy={97.2}
        speed={94.35}
        createdAt={Timestamp.fromDate(new Date("2026-03-30T11:17:40"))}
      />
      <MatchScore
        type={"best"}
        number={8}
        quote={"The Trial"}
        difficulty={"medium"}
        accuracy={100}
        speed={93.62}
        createdAt={Timestamp.fromDate(new Date("2024-07-12T10:20:40"))}
      />
      <MatchScore
        type={"best"}
        number={9}
        quote={"Animal Farm"}
        difficulty={"hard"}
        accuracy={99}
        speed={92.78}
        createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
      />
      <MatchScore
        type={"best"}
        number={10}
        quote={"Animal Farm"}
        difficulty={"hard"}
        accuracy={99}
        speed={91.24}
        createdAt={Timestamp.fromDate(new Date("2021-11-04T10:20:40"))}
      />
    </div>
  )
}