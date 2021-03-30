import { Request, Response } from 'express'
import roomData from '../roomData'

const roomDetailsController = (req: Request, res: Response) => {
  const room = req.params.room
  const { host, guests } = roomData.getRoomInfos(room)
  const { thumbnail, title } = roomData.getVideoDetails(room)
  res.json({ host, guests: guests.length, thumbnail, title })
}

export default roomDetailsController
