import { Server, Socket } from 'socket.io'
import { Response } from 'express'
import roomData from '../roomData'
import getVideoDetails from './videodetails'

let server: any = null
let io: any = null

const socketController = (req: any, res: Response) => {
  if (!server) {
    server = req.connection.server
    io = new Server(server)
    io.on('connection', function (socket: Socket) {
      const room = socket.handshake.query.room as string
      const user = socket.handshake.query.user as string
      const ID = socket.id
      socket.join(room)
      io.to(room).emit('guestsUpdate', {
        guestList: roomData.getRoomInfos(room).guests,
        newGuest: { name: user, action: 'joined' },
      })
      io.to(ID).emit('initialize', {
        roomInfos: roomData.getRoomInfos(room),
        videoDetails: roomData.getVideoDetails(room),
      })
      socket.on('playVideo', function () {
        if (
          !roomData.getRoomInfos(room).rights &&
          user !== roomData.getRoomInfos(room).host
        )
          return
        io.to(room).emit('playVideo')
        const roomInfos = roomData.getRoomInfos(room)
        roomInfos.playing = true
        roomData.setRoomInfos(room, roomInfos)
      })
      socket.on('pauseVideo', function () {
        if (
          !roomData.getRoomInfos(room).rights &&
          user !== roomData.getRoomInfos(room).host
        )
          return
        io.to(room).emit('pauseVideo')
        const roomInfos = roomData.getRoomInfos(room)
        roomInfos.playing = false
        roomData.setRoomInfos(room, roomInfos)
      })
      socket.on('seekTo', function (data) {
        if (
          !roomData.getRoomInfos(room).rights &&
          user !== roomData.getRoomInfos(room).host
        )
          return
        io.to(room).emit('seekTo', data)
      })
      socket.on('changeURL', function (url: string) {
        const roomInfos = roomData.getRoomInfos(room)
        roomInfos.url = url
        roomInfos.playing = true
        roomInfos.timer = 0
        roomData.setRoomInfos(room, roomInfos)
        const videoDetails = {
          error: false,
          title: '',
          description: '',
          thumbnail: '',
        }
        getVideoDetails(req.body.url)
          .then((response) => response.json())
          .then((response) => {
            const { title, description, thumbnails } = response.items[0].snippet
            videoDetails.title = title
            videoDetails.description = description
            videoDetails.thumbnail = thumbnails.medium.url
            io.to(room).emit('initialize', { roomInfos, videoDetails })
          })
          .catch(() => {
            videoDetails.error = true
            roomData.setVideoDetails(req.body.room, videoDetails)
            io.to(room).emit('initialize', roomInfos)
          })
      })
      socket.on('changeRights', function () {
        const roomInfos = roomData.getRoomInfos(room)
        roomInfos.rights = !roomInfos.rights
        roomData.setRoomInfos(room, roomInfos)
        io.to(room).emit('updateRights', roomInfos.rights)
      })
      socket.on('refreshTimer', function (time: number) {
        const roomInfo = roomData.getRoomInfos(room)
        if (user === roomInfo.host) {
          roomInfo.timer = time
          roomData.setRoomInfos(room, roomInfo)
        }
      })
      socket.on('messageSent', function (message: string) {
        io.to(room).emit('messageSent', {
          author: user,
          content: message,
        })
      })
      socket.on('disconnect', function () {
        const roomInfos = roomData.getRoomInfos(room)
        if (!roomInfos) return
        if (roomInfos.host === user) {
          io.to(room).emit('killRoom')
          roomData.deleteRoom(room)
          return
        }
        if (roomInfos.guests.includes(user)) {
          roomInfos.guests.splice(roomInfos.guests.indexOf(user), 1)
          io.to(room).emit('guestsUpdate', {
            guestList: roomData.getRoomInfos(room).guests,
            newGuest: { name: user, action: 'left' },
          })
        }
      })
    })
  }
  res.send('server is set')
}

export default socketController
