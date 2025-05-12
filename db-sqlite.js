import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import {setup} from "./setup.js"

// Open a database connection
const db = await open({
  filename: process.env.DATABASE_FILE || './database.sqlite',
  driver: sqlite3.Database,
})

setup()

// Export the database connection
export default db