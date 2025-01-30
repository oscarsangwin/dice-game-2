import { useState } from 'react'
import Slider from './components/Slider'
import DiceSelect from './components/DiceSelect'
import DiceTally from './components/DiceTally'

export default function InputPage(props) {
  const {
    showOutput,
    totCount,
    setTotCount,
    lostCount,
    setLostCount,
    lastCount,
    setLastCount,
    lastDiceVal,
    setLastDiceVal,
    knownDice,
    setKnownDice,
  } = props

  function addKnownDice(diceIdx) {
    setKnownDice(knownDice.map((val, idx) => {
      if (idx === diceIdx) {
        return val + 1
      } else {
        return val
      }
    }))
  }

  return (
    <>
      <div className="inner-row">
        <h2>Total dice</h2>
        <Slider
          count={totCount}
          setCount={setTotCount}
          leftIsReset={false}
        />
      </div>
      <div className="inner-row">
        <h2>Total removed</h2>
        <Slider
          count={lostCount}
          setCount={setLostCount}
          leftIsReset={false}
        />
      </div>
      <div className="last-guess-outer">
        <h2>Last guess</h2>
        <Slider
          count={lastCount}
          setCount={setLastCount}
          leftIsReset={true}
        />
        <DiceSelect
          diceSelectVal={lastDiceVal}
          setDiceSelectVal={setLastDiceVal}
          diceCountVal={lastCount}
          setDiceCountVal={setLastCount}
        />
      </div>
      <div className="inner-row">
        <h2>Known dice</h2>
        <button
          className='reset-known'
          onClick={() => {
            setKnownDice(Array(6).fill(0))
          }}
        >
          <i className="fa-solid fa-rotate-left"></i>
        </button>
      </div>
      <div className="add-dice-box">
        <DiceTally
            knownDice={knownDice}
            addKnownDice={addKnownDice}
        />
      </div>
      <div className="max"></div>
      <button
        className="do-calc-btn"
        onClick={() => {
          showOutput()
        }}
      >
        <h2>Caculate</h2>
        <i className="fa-solid fa-angles-right"></i>
      </button>
    </>
  )
}

// export default App
