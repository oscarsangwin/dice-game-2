
export default function Slider(props) {
    const {
        count,
        setCount,
        leftIsReset,
    } = props

    function isValidNum(raw) {
        if (raw === '') return false
        return !String(raw).split('').some(val => {
            return isNaN(parseInt(val))
        })
    }

    const inputClassName = isValidNum(count) ? "" : "input-invalid"

    return (
        <div className={`slider ${inputClassName}`}>
            <button onClick={() => {
                if (leftIsReset) {
                    setCount(0)
                } else {
                    if (isValidNum(count)) {
                        setCount(Math.max(0, parseInt(count) - 1))
                    }
                }
            }}>
                <i className={`fa-solid ${leftIsReset ? "fa-rotate-left" : "fa-angle-left"}`}></i>
            </button>
            <input
                value={count}
                onChange={e => setCount(e.target.value.trim())}
            />
            <button onClick={() => {
                if (isValidNum(count)) {
                    setCount(Math.max(0, parseInt(count) + 1))
                }
            }}>
                <i className="fa-solid fa-angle-right"></i>
            </button>
        </div>
    )
}
