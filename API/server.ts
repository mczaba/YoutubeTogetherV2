import express, { Request, Response } from 'express'
import multer from 'multer'
import { Server, Socket } from 'socket.io'
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
        console.log(roomMap.get(room).timer)
      })
    })
  }
  res.send('server is set')
})

app.post('/create', (req: Request, res: Response) => {
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
})

module.exports = {
  path: '/api',
  handler: app,
}
