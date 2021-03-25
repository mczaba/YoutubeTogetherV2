import { Request, Response } from 'express'
import roomData from '../roomData'

const roomDetailsController = (req: Request, res: Response) => {
  const room = req.params.room
  const roomInfos = roomData.getRoomInfos(room)
  res.json(roomInfos)
}

export default roomDetailsController
