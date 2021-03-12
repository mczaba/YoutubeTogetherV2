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
      socket.join(room)
      io.to(room).emit('initialize', roomMap.get(room))
      socket.on('playVideo', function () {
        io.to(room).emit('playVideo')
      })
      socket.on('pauseVideo', function () {
        io.to(room).emit('pauseVideo')
      })
      socket.on('seekTo', function (data) {
        io.to(room).emit('seekTo', data)
      })
      socket.on('refreshTimer', function (time: number) {
        const roomInfo = roomMap.get(room)
        roomInfo.timer = time
        roomMap.set(room, roomInfo)
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
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array()[0].msg)
    }
    if (rooms.includes(req.body.room)) {
      res.send('Ce nom de salon est déjà utilisé')
    } else {
      rooms.push(req.body.room)
      const roomInfos = {
        host: req.body.nickname,
        url: req.body.url,
        timer: 0,
        guests: [],
      }
      roomMap.set(req.body.room, roomInfos)
      res.send('salon créé')
    }
  }
)

module.exports = {
  path: '/api',
  handler: app,
}
