/** @format */

const router = require('express').Router()
const moment = require('moment')
const db = require('../db')

router.get('/current/:gameData', (req, res) => {
  const [id, player, password] = req.params.gameData.split('_')
  db.query(
    `SELECT * FROM games WHERE id = '${id}' AND password LIKE BINARY '${password}'`,
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: err })
      }
      if (data.length < 1)
        return res.status(404).json({ error: 'Invalid Code' })

      if (player == 2 && !data[0].player2)
        return res.status(500).json({ error: 'Please rejoin the game' })

      return res.json({
        player,
        name: data[0][`player${player}`],
        opponent: data[0][`player${player == 2 ? 1 : 2}`],
        game: data[0].id,
      })
    }
  )
})

router.post('/new', (req, res) => {
  const record = { player1: req.body.name, password: req.body.password }
  db.query('INSERT INTO games SET ? ', record, (er, data) => {
    if (er) console.log(er)
    console.log(data)
    return res.json({
      id: data.insertId,
      password: req.body.password,
    })
  })
})

router.post('/join', (req, res) => {
  const { name, id, password } = req.body
  db.query(
    `SELECT * FROM games WHERE id = '${id}' AND password LIKE BINARY '${password}'`,
    (err, data) => {
      if (data.length < 1 || err) {
        return res.status(401).json({ error: 'Invalid Credentials', err })
      } else {
        if (data[0].player2 == null) {
          const game = data[0]
          db.query(
            `update games set ? where id = '${id}'`,
            { player2: name },
            (err, data) => {
              if (err) return res.status(400).json({ error: err })
              console.log(data)
              return res.send({
                id: `${id}_2`,
                player1: game.player1,
                player2: name,
              })
            }
          )
        } else {
          return res.status(500).json({ error: 'Game full!' })
        }
      }
    }
  )
})

module.exports = router
