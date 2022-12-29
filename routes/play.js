/** @format */

const router = require('express').Router()
const db = require('../db')
// const wss = require('../WebSocket')
const { grid } = require('../core/playerActions')

router.post('/move', (req, res) => {
  const { gameId, player, row, column } = req.body

  //   const result = move(gameId, player, row, column)
  db.query(`SELECT * FROM games WHERE id='${gameId}'`, (err, data) => {
    if (err) return res.status(500).json({ success: false, error: err })
    if (data) {
      let { moves } = data[0]
      let mov = ''
      if (!moves) {
        mov = JSON.stringify([{ [player]: [row, column] }])
      } else {
        let m = JSON.parse(moves)

        // chck who is the last player
        if (m[m.length - 1][player])
          return res
            .status(500)
            .json({ success: false, error: 'You have already played' })

        // check if it exists in the players
        let f = m.filter(m => {
          let coord = Object.values(m)[0]
          return coord[0] == row && coord[1] == column
        })

        if (f.length === 0) {
          m.push({ [player]: [row, column] })
          mov = JSON.stringify(m)
          grid(gameId)
        } else {
          return res
            .status(500)
            .json({ success: false, error: 'That is already choosen' })
        }
      }
      db.query(
        `update games set ? where id ='${gameId}'`,
        { moves: mov },
        (err, data) => {
          if (err) return res.status(500).json({ success: false, error: err })
          else {
            grid(gameId)
            return res.json()
          }
        }
      )
    } else {
      return res
        .status(500)
        .json({ success: false, error: 'No Game of that ID' })
    }
  })
})

router.post('/reset', (req, res) => {
  const { gameId } = req.body
  db.query(
    `UPDATE games SET moves = NULL where id='${gameId}'`,
    (err, data) => {
      if (err) return res.status(500).json({ error: err })
      return res.json('Reset Successful')
    }
  )
})

module.exports = router
