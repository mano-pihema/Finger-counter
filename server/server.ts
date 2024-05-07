import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express()

server.use(express.static(path.join(__dirname, 'public')))
server.use(express.json())

export default server