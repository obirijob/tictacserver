/** @format */

const WebSocket = require('ws')
const { grid } = require('./core/playerActions')
const wss = new WebSocket.Server({ port: 2001 })

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
