/** @format */

const express = require('express')
const http = require('http')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('./db')

// require('./WebSocket')

const server = http.createServer(app)

const WebSocket = require('ws')
const { grid } = require('./core/playerActions')
const wss = new WebSocket.Server({ server })

const playerActions = require('./core/playerActions')

const connections = []

wss.on('connection', ws => {
  connections.push(ws)
  ws.on('message', async data => {
    const [action, actionData] = data.split('*<>*')
    switch (action) {
      case 'playermove':
        playerActions.move(actionData)
        break

      case 'registerSocket':
        const [player, gameId, opponent] = actionData.split('<//>')
        connections[player] = ws
        let dd = await grid(gameId)
        ws.send(dd)
        break

      case 'loadGrid':
        const [gId, ply, opp] = actionData.split('<//>')
        let d = await grid(gId)
        for (let c in connections) {
          if (c == ply || c == opp) {
            console.log(c)
            connections[c].send(d)
          }
        }
        break

      default:
        break
    }
  })
  ws.on('close', () => {
    console.log('client disconnected')
  })
})

app.use(bodyParser.json())
app.use(cors())

app.use('/game', require('./routes/game'))
app.use('/play', require('./routes/play'))

server.listen(2000, () => {
  console.log('💼 listening on port 2000!')
})
