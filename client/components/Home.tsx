import { useQuery } from "@tanstack/react-query"
import { getCards } from "../api/cards"


function Home () {

  const {data,isError,error,isPending} = useQuery({queryKey:['fetch'],queryFn:()=>getCards()})

  if(isPending) return(<h3>Loading...</h3>)
  if(isError) return (<div>{error.message}</div>)

    console.log(data)

  return (
    <div>
      <div>Home</div>
      <ul>
        {data.map(({id,word}:{id:number,word:string})=>(
          <li key={id}>{word}</li>
        ))}
      </ul>
    </div>
    
  )
}

export default Home