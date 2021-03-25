import { Request, Response } from 'express'
import fetch from 'node-fetch'

const videoDetailsController = (req: Request, res: Response) => {
  const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${req.params.id}&key=${process.env.API_KEY}`
  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((response) => {
      const { title, description, thumbnails } = response.items[0].snippet
      res.json({ title, description, thumbnail: thumbnails.medium.url })
    })
    .catch(() => {
      res
        .status(500)
        .send("Les informations de la vidéo n'ont pas pu être récupérées")
    })
}

export default videoDetailsController
