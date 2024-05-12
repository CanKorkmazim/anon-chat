type Config = {
    socketPort: number
    base: string
    memoryRoomMessagesLimit: 100
    socketServer: string
}

export default <Config>{
    socketServer: 'ws://localhost:9002',
    socketPort: 9002,
    base: '*',
    memoryRoomMessagesLimit: 100
}