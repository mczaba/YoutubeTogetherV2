import express, { Request, Response } from 'express'
import multer from 'multer'
import { Server, Socket } from 'socket.io'
import { body, CustomValidator, validationResult } from 'express-validator'
const app = express()

app.use('/', multer().none())

const rooms: string[] = []
const roomMap = new Map()
let server: any = null
let io: any = null

app.get('/init', (req: any, res: Response) => {
  if (!server) {
    server = req.connection.server
    io = new Server(server)
    io.on('connection', function (socket: Socket) {
      const room = socket.handshake.query.room
      const user = socket.handshake.query.user
      console.log(`${user} connected`)
      socket.join(room)
      io.to(room).emit('guestsUpdate', roomMap.get(room).guests)
      io.to(room).emit('initialize', roomMap.get(room))
      socket.on('playVideo', function () {
        if (!roomMap.get(room).rights && user !== roomMap.get(room).host) return
        io.to(room).emit('playVideo')
      })
      socket.on('pauseVideo', function () {
        if (!roomMap.get(room).rights && user !== roomMap.get(room).host) return
        io.to(room).emit('pauseVideo')
      })
      socket.on('seekTo', function (data) {
        if (!roomMap.get(room).rights && user !== roomMap.get(room).host) return
        io.to(room).emit('seekTo', data)
      })
      socket.on('refreshTimer', function (time: number) {
        const roomInfo = roomMap.get(room)
        if (user === roomInfo.host) {
          roomInfo.timer = time
          roomMap.set(room, roomInfo)
        }
      })
      socket.on('messageSent', function (message: string) {
        io.to(room).emit('messageSent', {
          author: user,
          content: message,
        })
      })
      socket.on('disconnect', function () {
        const roomInfos = roomMap.get(room)
        if (roomInfos.guests.includes(user)) {
          roomInfos.guests.splice(roomInfos.guests.indexOf(user), 1)
          io.to(room).emit('guestsUpdate', roomInfos.guests)
        }
      })
    })
  }
  res.send('server is set')
})

const youtubeValidator: CustomValidator = (value: string) => {
  if (!value.includes('www.youtube.com/watch?v='))
    throw new Error("Le lien youtube n'est pas valide")
  if (value.split('www.youtube.com/watch?v=')[1].length < 11)
    throw new Error("Le lien youtube n'est pas valide")
  return true
}

app.post(
  '/create',
  body('room')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le nom du salon doit faire au moins 4 caractères'),
  body('nickname')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le pseudo doit faire au moins 4 caractères'),
  body('url').trim().custom(youtubeValidator),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(220).send(errors.array()[0].msg)
    if (rooms.includes(req.body.room)) {
      res.send('Ce nom de salon est déjà utilisé')
    } else {
      rooms.push(req.body.room)
      const roomInfos = {
        host: req.body.nickname,
        url: req.body.url,
        rights: req.body.permissions === 'true',
        timer: 0,
        guests: [] as string[],
      }
      roomMap.set(req.body.room, roomInfos)
      res.send('salon créé')
    }
  }
)

app.post(
  '/join',
  body('room')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le nom du salon doit faire au moins 4 caractères'),
  body('nickname')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le pseudo doit faire au moins 4 caractères'),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(220).send(errors.array()[0].msg)
    if (!roomMap.has(req.body.room))
      return res.status(220).send("Ce salon n'existe pas")
    const room = roomMap.get(req.body.room)
    if (
      room.host === req.body.nickname ||
      room.guests.includes(req.body.nickname)
    )
      return res.status(220).send('Ce pseudo est déjà pris dans ce salon')
    room.guests.push(req.body.nickname)
    res.send('ok')
  }
)

module.exports = {
  path: '/api',
  handler: app,
}
