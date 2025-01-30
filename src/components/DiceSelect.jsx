
export default function DiceSelect(props) {
    const {
        diceSelectVal,
        setDiceSelectVal,
        diceCountVal,
        setDiceCountVal,
    } = props

    const diceNames = [
        'fa-dice-one',
        'fa-dice-two',
        'fa-dice-three',
        'fa-dice-four',
        'fa-dice-five',
        'fa-dice-six',
    ]

    return (
        <div className={`dice-selection ${diceCountVal ? "" : "no-last-dice"}`}>
            {diceNames.map((diceName, diceIdx) => (
                <button
                    key={diceIdx}
                    onClick={() => {
                        setDiceSelectVal(diceIdx)
                        if (diceCountVal === 0) {
                            setDiceCountVal(diceCountVal + 1)
                        }
                    }}
                    className={diceSelectVal === diceIdx && diceCountVal ? "dice-selected" : ""}
                >
                    <i className={`fa-solid ${diceName}`}></i>
                </button>
            ))}
        </div>
    )
}
