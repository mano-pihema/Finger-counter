import request from "superagent"

const serverUrl = '/api/v1/cards'

export function getCards() {
  return request.get(serverUrl).then((res)=>res.body)
}