import type {Server} from "socket.io";
import type {Rooms} from "../types";

export default function sendRooms(io:Server,rooms:Rooms,socketId: string) {
    io.to(socketId).emit('rooms', rooms)
}