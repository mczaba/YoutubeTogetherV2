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
  right: boolean
  timer: number
  guests: string[]
}

export { Message, guestUpdate, roomInfos }
