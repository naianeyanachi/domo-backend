import express, { Express } from 'express'
import bodyParser from 'body-parser'
import citadel from './routes/citadel'
import player from './routes/player'

const app: Express = express()
const port: number = 3000

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(bodyParser.json())

app.use('/api/citadel', citadel)
app.use('/api/player', player)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
