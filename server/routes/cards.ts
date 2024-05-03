import express  from "express";

import { fetchCards } from "../db/db";

const router = express.Router()

router.get('/',(req,res)=>{
  fetchCards()
  .then((cards)=>res.json(cards))
  .catch((err)=>res.status(500).send('DATABASE ERROR: ' + err.message))
})

export default router