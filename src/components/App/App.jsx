import "../../styles/index.css"
import styles from "./App.module.css"
import { Route, Routes } from "react-router-dom"
import { Header } from "../Header/Header"
import { Lobby } from "../Lobby/Lobby"
import { SoloPlay } from "../SoloPlay/SoloPlay"

function App() {
  return (
    <div className={styles.mainContainer}>
      <Header />

      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/solo" element={<SoloPlay />} />
      </Routes>
    </div>
  )
}

export default App