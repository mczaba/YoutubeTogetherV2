import { Request, Response } from 'express'
import roomData from '../roomData'

const roomListController = (_req: Request, res: Response) => {
  const roomList = roomData.getRoomList()
  res.json(roomList)
}

export default roomListController
