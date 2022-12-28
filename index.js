/** @format */

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('./db')

require('./WebSocket')

app.use(bodyParser.json())
app.use(cors())

app.use('/game', require('./routes/game'))
app.use('/play', require('./routes/play'))

app.listen(2000, () => {
  console.log('💼 listening on port 2000!')
})
