import knex from 'knex'
import config from './knexfile.js'

export type Environment = 'development'
const environment = (process.env.NODE_ENV || 'development') as Environment

const connection = knex.default(config[environment])

export default connection