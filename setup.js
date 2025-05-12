import fs from 'fs/promises';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Open database using sqlite3 in verbose mode
const db = new sqlite3.Database('database.sqlite');

// Promisify db.run
const runAsync = promisify(db.run.bind(db));

// Read and parse JSON file
const skylanders = JSON.parse(await fs.readFile('./public/skylanders.json', 'utf8'));

async function insertSkylanders() {
  // Create the table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS skylanders (
      id INTEGER PRIMARY KEY,
      name TEXT,
      game TEXT,
      element TEXT,
      series TEXT,
      type TEXT,
      chase TEXT
    )
  `);

  // Insert all records
  for (const s of skylanders) {
    await runAsync(
      `INSERT OR REPLACE INTO skylanders (id, name, game, element, series, type, chase)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [s.id, s.name, s.game, s.element, s.series, s.type, s.chase]
    );
  }

  console.log('All skylanders inserted.');
  db.close();
}

const setup = () => {
    insertSkylanders().catch(console.error);
}

export {setup}