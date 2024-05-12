import * as tmImage from '@teachablemachine/image'
import { useEffect, useRef, useState } from 'react'
function App() {
  const URL = '../../server/public/2nd_model/'
  const modelURL = URL + 'model.json'
  const metadataURL = URL + 'metadata.json'
  const [model, setModel] = useState<tmImage.CustomMobileNet>()
  const [prediction, setPrediction] = useState({ 0: 0, 1: 0, 2: 0 })
  const [number, setNumber] = useState('')
  const frames = 40
  const [sum, setSum] = useState([] as string[])
  const [result, setResult] = useState(0)
  const [blink, setBlink] = useState(false)
  const [on, setOn] = useState(false)
  const [gStream, setGStream] = useState<MediaStream | null>(null)
  const [classes, setClasses] = useState([] as string[])

  const operations = ['*', '+', '-', '/']

  useEffect(() => {
    async function setUpModel() {
      return await tmImage.load(modelURL, metadataURL)
    }
    setUpModel().then((res) => {
      setModel(res)
      const classNames = res.getClassLabels()
      setClasses(classNames)
    })
  }, [])

  useEffect(() => {
    if (prediction[1] > 0) {
      const value = Math.max(...Object.values(prediction))
      for (const key in prediction) {
        //@ts-expect-error possible null
        if (prediction[key] == value) {
          setNumber(key)
          setSum((prev) => [...prev, key])
        }
      }
    }
  }, [prediction])

  const webcamRef = useRef(null)

  function handleOnOff() {
    if (!on) {
      setUpCam()
    } else closeCam()
  }

  function closeCam() {
    gStream?.getTracks().forEach((track) => track.stop())
    //@ts-expect-error possible null
    webcamRef.current.srcObject = null
    setGStream(null)
    setOn(false)
  }

  async function setUpCam() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setGStream(stream)
        //@ts-expect-error possible null
        webcamRef.current.srcObject = stream
        //@ts-expect-error possible null
        webcamRef.current.style.transform = 'scaleX(-1)'
        setOn(true)
      })
  }
  function makePrediction() {
    setBlink(true)
    const id = setInterval(() => {
      setBlink(false)
      window.requestAnimationFrame(loop)
    }, 4000)
    setTimeout(() => {
      clearInterval(id)
    }, 4000)
  }
  async function loop() {
    let n = 0
    const arr = []
    do {
      //@ts-expect-error possible null
      webcamRef.current.play()
      //@ts-expect-error possible null
      arr.push(await model.predict(webcamRef.current))
      n++
    } while (n < frames)

    const final = arr.reduce(
      (acc, cur) => {
        for (const key in cur) {
          //@ts-expect-error type
          acc[key] += cur[key].probability
        }
        return acc
      },
      { 0: 0, 1: 0, 2: 0 }
    )
    setPrediction(final)
  }

  function equals() {
    setResult(eval(sum.join('')))
    setSum([])
  }

  return (
    <>
      <div>Finger counting</div>
      <button onClick={handleOnOff}>{on ? 'turn off' : 'start'}</button>
      <button onClick={makePrediction}> predict</button>
      <div className='video-container'>
        {blink && <div id='overlay'></div>}

        <video autoPlay ref={webcamRef} width={400} height={400} />
      </div>
      {blink && <div>please hold fingers up to green frame</div>}
      <span>
        {classes?.map((name, i) => (
          <p key={name}>
            {/* @ts-expect-error type  */}
            {name}:{(prediction[i] / frames).toFixed(2)}
          </p>
        ))}
      </span>
      <p>{number}</p>

      {operations.map((sign) => (
        <button key={sign} onClick={() => setSum((prev) => [...prev, sign])}>
          {sign}
        </button>
      ))}

      <button onClick={equals}>final</button>
      <p>{sum.join('')}</p>
      <p>{result}</p>
    </>
  )
}

export default App
