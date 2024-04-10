import Router from 'koa-router'
import * as constituentManager from '../managers/constituents'

interface ConstituentRequestBody {
  email: string
  name: string
  address: string
  signUpTime: string
}

const router = new Router()

router.get('/constituents', async (ctx) => {
  // @todo add validation for page and size
  const page = (ctx.query.page && parseInt(ctx.query.page as string)) || 1
  const size = (ctx.query.size && parseInt(ctx.query.size as string)) || 10
  const offset = (page - 1) * size

  const constituents = await constituentManager.getConstituentsChunk(
    ctx,
    offset,
    size,
  )
  ctx.body = constituents
})

router.post('/constituents', async (ctx) => {
  const { email, name, address, signUpTime } = ctx.request
    .body as ConstituentRequestBody
  if (!email || !name || !address || !signUpTime) {
    ctx.throw(400, 'Missing required fields')
  }
  // @todo add more validation on ConstituentModel within addConstituent manager

  const newConstituent = {
    email,
    name,
    address,
    signUpTime: new Date(signUpTime),
  }

  try {
    await constituentManager.addConstituent(ctx, newConstituent)
    ctx.status = 201
  } catch (error) {
    ctx.throw(500, 'Error adding constituent')
  }
})

router.get('/constituents/export', async (ctx) => {
  try {
    await constituentManager.csvOutput(ctx)
  } catch (error) {
    console.error('Export CSV error:', error)
    ctx.status = 500
    ctx.body = 'Internal Server Error'
  }
})

export default router
