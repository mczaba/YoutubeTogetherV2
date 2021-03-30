import express from 'express'
import multer from 'multer'

import socketController from './controllers/socket'
import createController from './controllers/create'
import joinController from './controllers/join'
import roomListController from './controllers/roomList'
import roomDetailsController from './controllers/roomDetails'

const app = express()

app.use('/', multer().none())

app.get('/init', socketController)
app.post('/create', createController)
app.post('/join', joinController)
app.get('/room/all', roomListController)
app.get('/details/:room', roomDetailsController)

module.exports = {
  path: '/api',
  handler: app,
}
