import type {Socket} from "socket.io";
import * as moment from "moment/moment";

export default function generateMessageString(socket: Socket, message: any) {
    return {
        userNick: socket.data.id,
        userId: socket.id,
        text: message.text,
        date: moment.utc().toISOString(true)
    }
}