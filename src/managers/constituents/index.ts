import { Constituent, ConstituentModel } from '../../models'
import { normalizeEmail } from '../../utils/normalizers'
import { Context } from 'koa'
import sqlite3 from 'sqlite3'
import { createObjectCsvStringifier } from 'csv-writer'
import { Readable } from 'stream'

export const addConstituent = async (
  ctx: Context,
  newConstituent: Constituent,
): Promise<void> => {
  const db = ctx.state.db as sqlite3.Database

  await ConstituentModel.addConstituent(
    db,
    normalizeEmail(newConstituent.email),
    newConstituent.name,
    newConstituent.address,
    new Date(newConstituent.signUpTime).getTime(),
  )
}

export const getTotalConstituents = async (ctx: Context) => {
  const db = ctx.state.db as sqlite3.Database

  return ConstituentModel.getTotalConstituents(db)
}

export const getConstituentsChunk = async (
  ctx: Context,
  offset: number,
  limit: number,
): Promise<Constituent[]> => {
  const db = ctx.state.db as sqlite3.Database

  return ConstituentModel.getConstituentsChunk(db, offset, limit)
}

export const csvOutput = async (ctx: Context) => {
  const header = [
    { id: 'email', title: 'Email' },
    { id: 'name', title: 'Name' },
    { id: 'address', title: 'Address' },
    { id: 'signUpTime', title: 'Sign Up Time' },
  ]

  const csvStringifier = createObjectCsvStringifier({ header })

  ctx.set('Content-Type', 'text/csv')
  ctx.set('Content-Disposition', 'attachment; filename=constituents.csv')

  const totalConstituents = await getTotalConstituents(ctx)
  let offset = 0
  const chunkSize = 1

  const csvStream = new Readable({
    async read() {
      while (offset < totalConstituents) {
        const constituents: Constituent[] = await getConstituentsChunk(
          ctx,
          offset,
          chunkSize,
        )
        const csvData = constituents
          .map((constituent: Constituent) =>
            csvStringifier.stringifyRecords([constituent]),
          )
          .join('\n')
        this.push(csvData)
        offset += chunkSize

        // Pause the stream if there are more constituents to fetch
        // for large loads
        if (offset < totalConstituents) {
          this.pause()
          await new Promise((resolve) => setTimeout(resolve, 1000))
          this.resume()
        }
      }
      this.push(null)
    },
  })

  csvStream.on('end', () => {
    ctx.res.end()
  })

  ctx.body = csvStream
}
