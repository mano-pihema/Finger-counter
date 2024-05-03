import db from './connection'

export function fetchCards() {
  return db('cards').select()
}