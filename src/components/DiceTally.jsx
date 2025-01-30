
export default function DiceTally(props) {
    const {
        knownDice,
        addKnownDice,
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
        <div className="dice-selection">
            {diceNames.map((diceName, diceIdx) => (
                <div
                    key={diceIdx}
                    className={knownDice[diceIdx] && "dice-at-least-one"}
                >
                    <button
                        onClick={() => {
                            addKnownDice(diceIdx)
                        }}
                    >
                        <i className={`fa-solid ${diceName}`}></i>
                    </button>
                    <p>
                        {knownDice[diceIdx]}
                    </p>
                </div>
            ))}
        </div>
    )
}
