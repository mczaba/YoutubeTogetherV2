import express, { Request, Response } from 'express'
import multer from 'multer'
const app = express()

app.use('/', multer().none())

app.post('/create', (req: Request, res: Response) => {
  console.log(req.body)
  res.send('cc')
})
app.get('/', (_req: Request, res: Response) => {
  console.log('cc')
  res.send('cc')
})

module.exports = {
  path: '/api',
  handler: app,
}
