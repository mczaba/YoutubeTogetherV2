type Message = { author: string; content: string }

type guestUpdate = {
  guestList: string[]
  newGuest: {
    name: string
    action: 'joined' | 'left'
  }
}

type roomInfos = {
  host: string
  url: string
  rights: boolean
  timer: number
  guests: string[]
  playing: boolean
}

export { Message, guestUpdate, roomInfos }
