import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import roomData from '../roomData'

const joinController = [
  body('room')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le nom du salon doit faire au moins 4 caractères'),
  body('nickname')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le pseudo doit faire au moins 4 caractères'),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(220).send(errors.array()[0].msg)
    if (!roomData.roomExists(req.body.room))
      return res.status(220).send("Ce salon n'existe pas")
    if (roomData.nameTaken(req.body.room, req.body.nickname))
      return res.status(220).send('Ce pseudo est déjà pris dans ce salon')
    roomData.addGuest(req.body.nickname, req.body.room)
    res.send('ok')
  },
]

export default joinController
