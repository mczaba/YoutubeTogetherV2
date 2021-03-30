type Message = { author: string; content: string }

type GuestUpdate = {
  guestList: string[]
  newGuest: {
    name: string
    action: 'joined' | 'left'
  }
}

type RoomInfos = {
  host: string
  url: string
  rights: boolean
  timer: number
  guests: string[]
  playing: boolean
}

type VideoDetails = {
  error: boolean
  thumbnail: string
  title: string
  description: string
}

type initializeData = {
  roomInfos: RoomInfos
  videoDetails: VideoDetails
}
export { Message, GuestUpdate, RoomInfos, VideoDetails, initializeData }
