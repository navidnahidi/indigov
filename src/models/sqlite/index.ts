import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import { Constituent } from '../constituents'

export async function setupDatabase() {
  const db = await open({
    filename: './indigov.db', // Specify the database file
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS constituents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      address TEXT,
      signUpTime INTEGER NOT NULL
    );
 `)

  return db
}

// @todo redo to not use db as a paramter, but a class with a singleton db
export const ConstituentModel = {
  addConstituent: async (
    db: sqlite3.Database,
    email: string,
    name: string,
    address: string,
    signUpTime: number,
  ): Promise<void> => {
    const stmt = await db.prepare(`
            INSERT INTO constituents (email, name, address, signUpTime)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
               name = excluded.name,
               address = excluded.address,
               signUpTime = excluded.signUpTime;
      `)
    await stmt.run(email, name, address, signUpTime)
    stmt.finalize()
  },

  getTotalConstituents: async (db: sqlite3.Database): Promise<number> => {
    const sql = `SELECT COUNT(1) as total FROM constituents`

    const result = await db.get(sql)

    const { total } = result as unknown as { total: number }

    return total
  },

  getConstituentsChunk: async (
    db: sqlite3.Database,
    offset: number,
    limit: number,
  ): Promise<Constituent[]> => {
    const sql = `SELECT * FROM constituents LIMIT ? OFFSET ?`

    const rows = await db.all(sql, [limit, offset])

    return rows as unknown as Constituent[]
  },
}
