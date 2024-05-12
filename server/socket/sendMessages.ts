import {type Server} from "socket.io";
import {type Messages} from "../types";

export default function sendMessages(io: Server, messages: Messages, socketId: string,) {
    io.to(socketId).emit('messages', messages)
}