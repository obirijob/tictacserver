/** @format */
const db = require('../db')

function checkWin() {
  const combination = [] // continue tomorrow
}

function move(gameId, player, row, column) {
  // const [gameId, player, row, column] = data.split('<//>')
  let result = { success: false, error: 'not acted' }
  db.query(`SELECT * FROM games WHERE id='${gameId}'`, (err, data) => {
    if (err) result = { success: false, error: err }
    if (data) {
      let { moves } = data[0]
      let mov = ''
      if (!moves) {
        mov = JSON.stringify([{ [player]: [row, column] }])
      } else {
        let m = JSON.parse(moves)

        // chck who is the last player
        if (m[m.length - 1][player])
          result = { success: false, error: 'You have already played' }

        // check if it exists in the players
        let f = m.filter(m => {
          let coord = Object.values(m)[0]
          return coord[0] == row && coord[1] == column
        })

        if (f.length === 0) {
          m.push({ [player]: [row, column] })
          mov = JSON.stringify(m)
          result = { success: true }
        } else {
          result = { success: false, data: 'That is already choosen' }
        }
      }
      db.query(
        `update games set ? where id ='${gameId}'`,
        { moves: mov },
        (err, data) => {
          if (err) result = { success: false, error: err }
        }
      )
    } else {
      result = { success: false, error: 'No Game of that ID' }
    }
  })

  return result
}

async function grid(gameId) {
  const data = await new Promise((res, rej) => {
    db.query(`select * from games where id ='${gameId}'`, (err, data) => {
      if (data.length < 1) res([]) //ws.send(`${gameId}<*-*>[]`)
      res(data[0].moves)
    })
  })
  return data
}

module.exports = { move, grid }
