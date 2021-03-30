import { RoomInfos, VideoDetails } from '../assets/types'

const roomData = (() => {
  const rooms: string[] = []
  const roomInfosMap = new Map()
  const roomVideoDetailsMap = new Map()

  // getters
  const getRoomList = () => [...rooms]
  const getRoomInfos = (room: string) => {
    return { ...roomInfosMap.get(room) }
  }
  const getVideoDetails = (room: string) => {
    return { ...roomVideoDetailsMap.get(room) }
  }
  const roomExists = (room: string) => {
    return rooms.includes(room)
  }
  const nameTaken = (room: string, name: string): boolean => {
    const { host, guests } = roomInfosMap.get(room)
    return name === host || guests.includes(name)
  }

  // setters
  const setRoomInfos = (room: string, data: RoomInfos) => {
    roomInfosMap.set(room, data)
  }
  const setVideoDetails = (room: string, data: VideoDetails) => {
    roomVideoDetailsMap.set(room, data)
  }
  const addGuest = (guest: string, room: string) => [
    roomInfosMap.get(room).guests.push(guest),
  ]
  const deleteRoom = (room: string) => {
    roomInfosMap.delete(room)
    rooms.splice(rooms.indexOf(room), 1)
  }
  const addRoom = (room: string, data: RoomInfos) => {
    rooms.push(room)
    roomInfosMap.set(room, data)
  }
  return {
    getRoomInfos,
    getRoomList,
    setRoomInfos,
    addGuest,
    deleteRoom,
    addRoom,
    roomExists,
    nameTaken,
    getVideoDetails,
    setVideoDetails,
  }
})()

export default roomData
