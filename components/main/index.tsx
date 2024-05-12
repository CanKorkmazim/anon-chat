"use client"

import {type ReactNode, useEffect, useRef, useState} from "react";
import mainStyles from "./index.module.scss"
import io, {type Socket} from "socket.io-client";
import Tabs from "@/components/main/tabs";
import Messages from "@/components/main/messages";
import SubmitInput from "@/components/main/submitInput";
import {cn} from "@/lib/utils";
import msgParser from "socket.io-msgpack-parser";
import {storeMe} from "@/store/me";
import {storeMessageCount, storeUserCount} from "@/store/totalCount";
import {storeMessages} from "@/store/messages";
import {storeTabs} from "@/store/tabs";
import {useToast} from "@/components/ui/use-toast";

interface Props {
    children?: ReactNode
    socketServer: string
}

export default function Main({socketServer}: Props) {
    let submitInputRef = useRef<HTMLInputElement>(null)

    let [ep, setEp] = useState<Socket | undefined>()
    let {addMessage, setMessageList} = storeMessages()
    let {hasTab, isRoom, addTab, isActiveTab, setNewTab, setList: setRoomList, setActiveTab} = storeTabs()
    let notificationPlayer = useRef<HTMLAudioElement>(null)
    let messagesScrollRef = useRef<HTMLDivElement>(null)
    let {toast} = useToast()

    useEffect(() => {
        let socket = io(socketServer, {
            transports: ['websocket'],
            parser: msgParser,
            path: '/'
        });

        socket.on('connect', () => {
            setEp(socket);
            socket.emit('register')
        })

        socket.on('messages', (message) => {
            setMessageList(message)
        })

        socket.on('message', (message) => {
            addMessage(message.room, message)

            if (!hasTab(message.room)) addTab({
                type: 'pm',
                title: message.userNick,
                short: message.userNick,
                isNew: true
            })

            if (!isActiveTab(message.room)) {
                setNewTab(message.room, true)
                if (!isRoom(message.room)) void notificationPlayer.current?.play()
            }
        });


        socket.on('register.success', message => {
            storeMe.setState({id: message.id, nick: message.nick})
        })

        socket.on('info', message => {
            if (message.totalUser) storeUserCount.setState(message.totalUser)
            if (Number.isInteger(message.totalMessage)) storeMessageCount.setState(message.totalMessage)
        })

        socket.on('rooms', (message) => {
            setRoomList(message)

            let getDefaultRoom = message.find((e: any) => e.default);
            if (getDefaultRoom) setActiveTab(getDefaultRoom.short);
        })


        socket.on('error', (error) => {

            toast({
                variant: "destructive",
                description: error.message,
            })

        })


        return () => {
            socket.disconnect();
            socket.removeAllListeners()
        };
    }, []);

    return (
        <main className={cn('w-full rounded p-2 flex flex-col gap-2', mainStyles.main)}>
            <Tabs socket={ep} submitInputRef={submitInputRef}/>
            <Messages submitInputRef={submitInputRef} messagesScrollRef={messagesScrollRef}/>
            <SubmitInput socket={ep} ref={submitInputRef}/>
            <audio ref={notificationPlayer} src="/notification.mp3"/>
        </main>
    )
}