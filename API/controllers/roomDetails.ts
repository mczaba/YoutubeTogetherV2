import { Request, Response } from 'express'
import roomData from '../roomData'

const roomDetailsController = (req: Request, res: Response) => {
  const room = req.params.room
  const roomInfos = roomData.getRoomInfos(room)
  const videoDetails = roomData.getVideoDetails(room)
  res.json({ roomInfos, videoDetails })
}

export default roomDetailsController
