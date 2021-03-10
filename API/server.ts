import express, { Request, Response } from 'express'
import multer from 'multer'
import { Server, Socket } from 'socket.io'
const app = express()

app.use('/', multer().none())

const rooms: string[] = []
const ownerMap = new Map()
let server: any = null
let io = null

app.get('/init', (req: any, res: Response) => {
  if (!server) {
    server = req.connection.server
    io = new Server(server)
    io.on('connection', function (socket: Socket) {
      socket.on('msg', (msg: string) => {
        console.log('Recived: ' + msg)
      })
    })
  }
  res.send('server is set')
})

app.post('/create', (req: Request, res: Response) => {
  console.log('2eme middleware')
  if (rooms.includes(req.body.room)) {
    res.send('Ce nom de salon est déjà utilisé')
  } else {
    rooms.push(req.body.room)
    ownerMap.set(req.body.room, req.body.nickname)
    res.send('salon créé')
  }
})

module.exports = {
  path: '/api',
  handler: app,
}
