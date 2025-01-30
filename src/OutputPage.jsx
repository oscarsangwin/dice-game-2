import { useEffect, useState } from "react"

export default function OutputPage(props) {
	const {
		returnToInput,
		totCount,
		lostCount,
		lastCount,
		lastDiceVal,
		knownDice,
	} = props

	const maxDisplayRows = 10

	const [outputData, setOutputData] = useState({
		status: 'error',
		content: 'Loading...',
	})

	function updateCalc() {
		const unknownDice = totCount - lostCount - knownDice.reduce((acc, val) => acc + val, 0)

		if (unknownDice <= 0 || lastCount >= totCount - lostCount) {
			setOutputData({
				status: 'error',
				content: 'Invalid input'
			})
			return
		}

		let nCr_vals = [1]
		for (let r = 1; r <= unknownDice; r++) {
			nCr_vals.push(Math.round(nCr_vals.at(-1) * (unknownDice - r + 1) / r))
		}

		
		let individualProbs = nCr_vals.map((val, r) => {
			return val * 5 ** (unknownDice - r) / 6 ** unknownDice
		})
		
		let exactoProb
		if (lastCount === 0) {
			exactoProb = 'N/A'
		} else if (knownDice[lastDiceVal] > lastCount) {
			exactoProb = 0
		} else {
			exactoProb = (individualProbs[lastCount - knownDice[lastDiceVal]] * 100).toFixed(1)
		}

		let sumProbs = [individualProbs[0]]
		for (let i = 1; i <= unknownDice; i++) {
			sumProbs.push(individualProbs[i] + sumProbs.at(-1))
		}
		sumProbs = sumProbs.map(val => val.toFixed(4))

		let allProbs = []
		for (let diceIdx = 0; diceIdx < 6; diceIdx++) {
			const maxPossible = totCount - lostCount - knownDice.reduce((acc, val) => acc + val, 0) + knownDice[diceIdx]
			let probs = []

			for (let qtyGuess = maxPossible; qtyGuess >= 0; qtyGuess--) {
				if (knownDice[diceIdx] >= qtyGuess) {
					probs.push(100)
				} else {
					probs.push(parseFloat(((1 - sumProbs[qtyGuess - knownDice[diceIdx] - 1]) * 100).toFixed(2)))
				}
			}

			allProbs.push(probs)
		}

		const maxLenRow = allProbs.reduce((acc, probRow) => Math.max(probRow.length, acc), 0)
		allProbs = allProbs.map(arr => arr.length < maxLenRow ? Array(maxLenRow - arr.length).fill(0).concat(arr) : arr)
		allProbs.forEach(arr => arr.reverse())

		let zipped = Array.from({length: maxLenRow}, (_, i) => allProbs.map(probRow => probRow[i]))
		zipped = zipped.slice(Math.max(lastCount, 1)).slice(0, maxDisplayRows)
		
		let bluffProb = 'N/A'
		if (lastCount !== 0) {
			bluffProb = (100-zipped[0][lastDiceVal]).toFixed(1)
		}

		const bestNextProb = Math.max(...zipped[Math.min(1, lastCount)])
		const bestNext = zipped[Math.min(1, lastCount)].indexOf(bestNextProb)

		setOutputData({
			status: 'ok',
			content: zipped,
			bluffProb: bluffProb,
			exactoProb: exactoProb,
			bestNext: bestNext,
			bestNextProb: bestNextProb.toFixed(1),
		})
	}
	useEffect(updateCalc, [])

	function generateTblBody() {
		return (
			outputData.content.map((probRow, probIdx) => {
				return (
					<tr key={probIdx}>
						<td key={probIdx} className="left-col">
							{probIdx + parseInt(lastCount) + (lastCount === 0) * 1}
						</td>
						{probRow.map((cell, cellIdx) => {
							return (
								<td
									key={cellIdx}
									className={`pc-cell
										${probIdx + (lastCount === 0) * 1 === 0 && cellIdx === lastDiceVal ? "last-dice-cell" : ""}
										${probIdx + (lastCount === 0) * 1 === 1 && cellIdx === outputData.bestNext ? "next-dice-cell" : ""}
									`}
									style={
										{backgroundColor: `rgba(150, 194, 156, ${cell/100})`}
									}
								>
									{cell > 99.5 || cell < 0.5 ? "" : cell.toFixed(0) + "%"}
								</td>
							)
						})}
					</tr>
				)
			})
		)
	}

	const diceNames = [
		'fa-dice-one',
		'fa-dice-two',
		'fa-dice-three',
		'fa-dice-four',
		'fa-dice-five',
		'fa-dice-six',
	]

	if (outputData.status === 'ok') {
		return (
			<>
				<h2>Odds of Success</h2>

				<div className="results-overview">
					<h3>
						<span className="prob-text-outer">P(</span>
							Bluff
						<span className="prob-text-outer">)</span>
					</h3>
					<h4>{outputData.bluffProb}<span className="prob-text-outer">%</span></h4>
					<h3>
						<span className="prob-text-outer">P(</span>
							Guess
							<span className="guess-dice-icon">{parseInt(lastCount) + 1}</span>
							<i className="fa-solid fa-xmark"></i>
							<i className={`fa-solid ${diceNames[outputData.bestNext]} guess-dice-icon`}></i>
						<span className="prob-text-outer">)</span>
					</h3>
					<h4>
						{outputData.bestNextProb}<span className="prob-text-outer">%</span>
						<p>...<em>if</em> bluff called*</p>
					</h4>
					<h3>
						<span className="prob-text-outer">P(</span>
							Exacto
						<span className="prob-text-outer">)</span>
					</h3>
					<h4>{outputData.exactoProb}<span className="prob-text-outer">%</span></h4>
				</div>

				<table>
					<thead>
						<tr>
							<th></th>
							{Array.from({length: 6}, (_, i) => {
								return (
									<th key={i}>
										<i className={`fa-solid ${diceNames[i]}`}></i>
									</th>
								)
							})}
						</tr>
					</thead>
					<tbody>
						{outputData.content.length > 0 ? generateTblBody() : 
							<td className="tbl-no-data" colSpan={7}>
								No data: please check parameters
							</td>
						}
					</tbody>
				</table>

				<div className="max"></div>
				<button
					className="do-calc-btn"
					onClick={() => {
						returnToInput()
					}}
				>
					<i className="fa-solid fa-angles-left"></i>
					<h2>Go back</h2>
					<p>
						* Probability assumming next player calls your bluff (underestimate)
					</p>
				</button>
			</>
		)
	} else {
		return (
			<>
				<h2>Output</h2>
				<p className="error-text">Error: {outputData.content}</p>
				<div className="max"></div>
				<button
					className="do-calc-btn"
					onClick={() => {
						returnToInput()
					}}
				>
					<i className="fa-solid fa-angles-left"></i>
					<h2>Go back</h2>
				</button>
			</>
		)
	}
}
