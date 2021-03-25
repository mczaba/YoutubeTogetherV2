import express from 'express'
import multer from 'multer'

import socketController from './controllers/socket'
import createController from './controllers/create'
import joinController from './controllers/join'
import videoDetailsController from './controllers/videodetails'

const app = express()

app.use('/', multer().none())

app.get('/init', socketController)
app.post('/create', createController)
app.post('/join', joinController)
app.get('/videodetails/:id', videoDetailsController)

module.exports = {
  path: '/api',
  handler: app,
}
