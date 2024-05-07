
import * as tmImage from '@teachablemachine/image'
import { useEffect, useRef, useState } from 'react';
function App() {

  const URL = '../../server/public/my_model/'
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  const [model,setModel] = useState<tmImage.CustomMobileNet>()
  const [prediction,setPrediction] = useState({1:0,2:0})
  const [number,setNumber] = useState('')
  const frames = 40
  const [sum,setSum] = useState([] as string[])
  const [result,setResult] = useState(0)
  
  useEffect(()=>{
   async function setUpModel() {
     return await tmImage.load(modelURL, metadataURL)
    }
    setUpModel().then((res)=>setModel(res))
  },[])

  useEffect(()=>{
    if(prediction[1]>0){
      const value = Math.max(...Object.values(prediction))
      for (const key in prediction) {
         //@ts-expect-error possible null
       if(prediction[key]==value){
        setNumber(key)
        setSum(prev => [...prev,key])
       } 
      }
    }
  },[prediction])

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
    while(n<frames)
    
    const final = arr.reduce((acc,cur)=>{
      acc[1]+=cur[0].probability
      acc[2]+=cur[1].probability
      return acc
    },{1:0,2:0})
    setPrediction(final)

    console.log(sum.join(''))

}

  return (
    <>
    <div>App</div>
    <button onClick={setUpCam}>start</button>
    <video autoPlay  ref={webcamRef} width={200} height={200}/>
    <p>one:{prediction[1]/frames}</p>
    <p>two:{prediction[1]/frames}</p>
    <p>{number}</p>
    <button onClick={()=> setSum(prev => [...prev,'+'])}>+</button>
    <button onClick={()=>setResult(eval(sum.join('')))}>final</button>
    <p>{sum.join('')}</p>
    <p>{result}</p>
    </>
  )
}

export default App
