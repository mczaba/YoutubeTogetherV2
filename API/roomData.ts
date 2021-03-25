import { roomInfos } from '../assets/types'

const roomData = (() => {
  const rooms: string[] = []
  const roomMap = new Map()
  const getRoomInfos = (room: string) => {
    return { ...roomMap.get(room) }
  }
  const getRoomList = () => [...rooms]
  const setRoomInfos = (room: string, data: roomInfos) => {
    roomMap.set(room, data)
  }
  const addGuest = (guest: string, room: string) => [
    roomMap.get(room).guests.push(guest),
  ]
  const deleteRoom = (room: string) => {
    roomMap.delete(room)
    rooms.splice(rooms.indexOf(room), 1)
  }
  const addRoom = (room: string, data: roomInfos) => {
    rooms.push(room)
    roomMap.set(room, data)
  }
  const roomExists = (room: string) => {
    return rooms.includes(room)
  }
  const nameTaken = (room: string, name: string) => {
    const { host, guests } = roomMap.get(room)
    return name === host || guests.includes(name)
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
  }
})()

export default roomData
