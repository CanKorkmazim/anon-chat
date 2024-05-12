export type Message = {
    userNick: string | number
    userId: string
    text: string
    date: string
}
export type Messages = { [key: string]: Message[] }
export type Room = {
    type: string,
    short: string,
    title: string,
    image: string,
    default?: boolean
}
export type Rooms = Room[]

export type Registered = {
    id: string
    ip: string
    nick: string | number
}