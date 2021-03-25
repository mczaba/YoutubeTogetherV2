import { body, CustomValidator, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import roomData from '../roomData'

const youtubeValidator: CustomValidator = (value: string) => {
  if (!value.includes('www.youtube.com/watch?v='))
    throw new Error("Le lien youtube n'est pas valide")
  if (value.split('www.youtube.com/watch?v=')[1].length < 11)
    throw new Error("Le lien youtube n'est pas valide")
  return true
}

const createController = [
  body('room')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le nom du salon doit faire au moins 4 caractères'),
  body('nickname')
    .trim()
    .isLength({ min: 4 })
    .withMessage('Le pseudo doit faire au moins 4 caractères'),
  body('url').trim().custom(youtubeValidator),
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(220).send(errors.array()[0].msg)
    if (roomData.roomExists(req.body.room)) {
      res.send('Ce nom de salon est déjà utilisé')
    } else {
      const roomInfos = {
        host: req.body.nickname,
        url: req.body.url,
        rights: req.body.permissions === 'true',
        timer: 0,
        playing: false,
        guests: [] as string[],
      }
      roomData.addRoom(req.body.room, roomInfos)
      res.send('salon créé')
    }
  },
]

export default createController
