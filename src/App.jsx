import { useState , useEffect} from 'react'
import './App.css'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [nums, setNums] = useState(allNewDice())
  const [tenze, setTenze] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [counter, setCounter] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [start, setStart] = useState(false)
  const [score, setScore] = useState(localStorage.getItem('score'))
  

  useEffect(() => {
    if (!startTimer) return;

    const timer = setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter, startTimer]);

  const handleStartTimer = () => {
    setStartTimer(true);
  };

  useEffect(() => {
    let ArrTrue = []
    let ArrLast = []

    nums.map(num => {
      if (num.isHold) {
        ArrTrue.push(num)
      }
    })
    ArrTrue.map(val => {
      ArrLast.push(val.value)
    })

    if (Array.from(new Set(ArrLast)).length == 1 && ArrTrue.length == 10) {
      setTenze(true)
    }
    
    }
  , [nums])

  function GenNewDie() {
      return {
        value: Math.ceil(Math.random() * 6),
        isHold: false,
        id: nanoid()
      }
  }

  function Show() {
    nums.map(li => <li onClick={() => handelDice(li.id)} key={li.id} style={{backgroundColor: li.isHold ? "#59E391": "white"}}>{li.value}</li>)
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(GenNewDie())
    }
    return newDice
  }

  function handelDice(id) {
    setNums(data => data.map(dis => {
      return dis.id === id ? 
        {...dis, isHold: !dis.isHold}:
        dis
    }))
  }

  function rollDice() {
    setNums(oldDice => oldDice.map(die => {
      return die.isHold ? 
        die : 
        GenNewDie()
    }))
    setRolls(rolls + 1)
  }

  function PlayAgain() {
    setNums(() => allNewDice())
    setTenze(!tenze)
    setRolls(0)
    setCounter(0)
    setStart(false)
  }

  function Start() {
    setStart(true)
    rollDice()
    setRolls(0)
    handleStartTimer()
    
  }


  useEffect(() => {
    if (tenze) {
    setStartTimer(!startTimer)
    setCounter(counter)
    setHighScore()
  }
  }, [tenze])
  
  function setHighScore() {
    if (counter < Number(localStorage.getItem('score'))) {
      localStorage.setItem('score', counter)
      setScore(counter)
    }
  }

  function SetButton() {
    if (start) {
      if (tenze) {
          return <button onClick={PlayAgain}>Play again</button> 
        } else {
          return <button onClick={rollDice} >Roll</button>
        }
    }else {
      return <button onClick={Start} >Start</button>
    }
  }
  return (
    <main>
      {tenze && <Confetti />}
      <div className="box">
        <div className="top">
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </div>
        <div className="top-Mid">
          <div className="Score">
            <p>Best-Sc</p>
            <span>{score} sec</span>
          </div>
          <div className="Score">
            <p>Timer</p>
            <span>{counter} Sec</span>
          </div>
          <div className="Score">
            <p>Rolls</p>
            <span>{rolls}</span>
          </div>
        </div>
        <div className="mid">
          <ul>
            {start && nums.map(li => <li onClick={() => handelDice(li.id)} key={li.id} style={{backgroundColor: li.isHold ? "#59E391": "white"}}>{li.value}</li>)}
          </ul>
        </div>
        <div className="bot">
          {SetButton()}
        </div>
      </div>
    </main>
  )
}

export default App

