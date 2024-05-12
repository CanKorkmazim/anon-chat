import {type Server} from "socket.io";
import type {Messages, Rooms} from "../types";

type TotalUser = {
    [key: string]: number
}

export default function sendTotalValues(io: Server, rooms: Rooms, messages: Messages, messageCounter: number, socketId?: string) {
    let totalUser: TotalUser = {}

    for (let room of rooms.map(e => e.short)) {
        let getRoom = io.sockets.adapter.rooms.get(room);

        totalUser[room] = getRoom
            ? getRoom.size
            : 0
    }

    io.to(socketId ? socketId : 'registered').emit('info', {
        totalUser,
        // totalMessage: Object.values(messages).map(e => e.length).reduce((a, b) => a + b, 0)
        totalMessage: messageCounter
    })


}