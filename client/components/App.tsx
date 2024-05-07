
import * as tmImage from '@teachablemachine/image'
import { useEffect, useRef, useState } from 'react';
function App() {

  const URL = '../../server/public/my_model/'
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  const [model,setModel] = useState<tmImage.CustomMobileNet>()
  const [prediction,setPrediction] = useState({one:0,two:0})
  
  useEffect(()=>{
   async function setUpModel() {
     return await tmImage.load(modelURL, metadataURL)
    }
    setUpModel().then((res)=>setModel(res))
  },[])

  const webcamRef = useRef(null)

   async function setUpCam() {
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      //@ts-expect-error possible null
      webcamRef.current.srcObject = stream
      window.requestAnimationFrame(loop)
    })
    
  }
  async function loop() {
    let n = 0
    const arr = []
    do{
    //@ts-expect-error possible null
    webcamRef.current.play()
    //@ts-expect-error possible null
    arr.push(await model.predict(webcamRef.current))
    n++
    }
    while(n<40)
    
    const final = arr.reduce((acc,cur)=>{
      acc.one+=cur[0].probability
      acc.two+=cur[1].probability
      return acc
    },{one:0,two:0})
    setPrediction(final)
}

  return (
    <>
    <div>App</div>
    <button onClick={setUpCam}>start</button>
    <video autoPlay  ref={webcamRef} width={200} height={200}/>
    <p>one:{prediction.one/40}</p>
    <p>two:{prediction.two/40}</p>
   
    
    </>
  )
}

export default App
