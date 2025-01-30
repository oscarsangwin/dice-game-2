import { useState } from "react";
import InputPage from "./InputPage";
import OutputPage from "./OutputPage";

export default function App() {
    const [appState, setAppState] = useState('user-input')

    const [totCount, setTotCount] = useState(30)
    const [lostCount, setLostCount] = useState(0)

    const [lastCount, setLastCount] = useState(0)
    const [lastDiceVal, setLastDiceVal] = useState(0)

    const [knownDice, setKnownDice] = useState(Array(6).fill(0))

    function showOutput() {
        setAppState("display-output")
    }

    function returnToInput() {
        setAppState("user-input")
    }

    if (appState === 'user-input') {
        return (
            <main className="input-page">
                <InputPage
                    showOutput={showOutput}
                    totCount={totCount}
                    setTotCount={setTotCount}
                    lostCount={lostCount}
                    setLostCount={setLostCount}
                    lastCount={lastCount}
                    setLastCount={setLastCount}
                    lastDiceVal={lastDiceVal}
                    setLastDiceVal={setLastDiceVal}
                    knownDice={knownDice}
                    setKnownDice={setKnownDice}
                />
            </main>
        )
    } else if (appState === "display-output") {
        return (
            <main className="output-page">
                <OutputPage
                    returnToInput={returnToInput}
                    totCount={totCount}
                    lostCount={lostCount}
                    lastCount={lastCount}
                    lastDiceVal={lastDiceVal}
                    knownDice={knownDice}
                />
            </main>
        )
    } else {
        console.error('Unknown app state value')
    }
}
