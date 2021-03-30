import fetch from 'node-fetch'

const getVideoDetails = (url: string) => {
  const ID = url.split('v=')[1].split('&')[0]
  const APIurl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${ID}&key=${process.env.API_KEY}`
  return fetch(APIurl)
}

export default getVideoDetails
