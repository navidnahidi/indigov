import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './routes/constituents'
import db from './models'

const app = new Koa()
const PORT = 3000

app.use(bodyParser())
app.use(async (ctx, next) => {
  ctx.state.db = await db()
  await next()
})
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
