import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import cards from './routes/cards'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express()

server.use(express.static(path.join(__dirname, 'public')))
server.use(express.json())

server.use('/api/v1/cards', cards)
export default server