import {Server, type Socket} from "socket.io"
import {Messages, Registered, Rooms} from "./types";
import sendMessages from "./socket/sendMessages";
import sendTotalValues from "./socket/sendTotalValues";
import generateMessageString from "./socket/generateMessageString";
import sendRooms from "./socket/sendRooms";
import * as msgParser from "socket.io-msgpack-parser"
import config from "../config"

let io = new Server({
    cors: {
        origin: config.base,
        credentials: false
    },
    parser: msgParser,
    path: '/',
    serveClient: false
});

let counter = 100;
let messageCounter = 0;
let users: Registered[] = []

let rooms: Rooms = [
    {type: 'room', short: 'cs', title: 'Counter-Strike 1.6', image: 'cs.png', default: true},
    {type: 'room', short: 'csgo', title: 'Counter-Strike GO', image: 'csgo.png'},
    {type: 'room', short: 'ts3', title: 'Teamspeak 3', image: 'ts3.png'}
]

let messages: Messages = Object.fromEntries(rooms.map(e => [e.short, []]))

io.on('connection', (socket: Socket) => {

    socket.on('register', () => {
        let cfIp = socket.handshake.headers['cf-connecting-ip']
            ? socket.handshake.headers['cf-connecting-ip']
            : socket.handshake.address;

        if (Array.isArray(cfIp)) cfIp = cfIp[0]
        let userIndex = users.findIndex(e => e.ip === cfIp)

        if (userIndex !== -1) {
            let userId = users[userIndex]['id']
            if (socket.id !== userId && io.sockets.adapter.rooms.has(users[userIndex]['id'])) return socket.emit('error', {
                type: 'multiple_connection',
                message: 'Bir IP adresinden aynı anda bir oturum açılabilir.'
            })

            users[userIndex]['id'] = socket.id
        } else {
            users.push({
                ip: cfIp,
                id: socket.id,
                nick: ++counter
            })
        }

        userIndex = users.findIndex(e => e.ip === cfIp)

        let user = users[userIndex];
        console.log(user)
        socket.data.id = user.nick
        socket.join('registered');

        let findDefaultRoom = rooms.find(e => e.default);

        if (findDefaultRoom) socket.join(findDefaultRoom.short)

        socket.emit('register.success', user)

        sendTotalValues(io, rooms, messages, messageCounter, socket.id)
        sendRooms(io, rooms, socket.id);
        sendMessages(io, messages, socket.id);
    })

    socket.on('message.send', (message) => {
        let generateMessage = generateMessageString(socket, message);
        let roomShorts = rooms.map(e => e.short);
        let isRoom = roomShorts.indexOf(message.room) !== -1;

        if (isRoom) {
            io.to('registered').emit('message', {
                room: message.room,
                ...generateMessage
            })

            messages[message.room].push(generateMessage)
            if (messages[message.room].length > config.memoryRoomMessagesLimit) messages[message.room].shift()

            return messageCounter++
        }

        const findUser = users.find(e => e.nick == message.room);

        if (!findUser || !io.sockets.adapter.rooms.has(findUser.id)) {
            return socket.emit('error', {
                type: 'unknown_user',
                message: 'Ulaşmaya çalıştığınız kullanıcı siteden çıkış yapmış'
            })
        }

        io.to(findUser.id).emit('message', {
            room: socket.data.id,
            ...generateMessage
        })

        io.to(socket.id).emit('message', {
            room: message.room,
            ...generateMessage
        })

    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected.`);
    });

    socket.on('room.join', (room) => {
        // Default room keys
        let roomShorts = rooms.map(e => e.short);

        // Not found in default rooms
        if (roomShorts.indexOf(room) === -1) return

        let roomDiff = roomShorts.filter(e => e !== room);
        for (let r of roomDiff) {
            // Leave others
            if (socket.rooms.has(r)) socket.leave(r)
        }

        // Join new room
        socket.join(room)
        sendTotalValues(io, rooms, messages, messageCounter, socket.id)
    })
});


setInterval(() => sendTotalValues(io, rooms, messages, messageCounter), 1000)
io.listen(config.socketPort)
console.log('Socket server started wia port ' + config.socketPort)