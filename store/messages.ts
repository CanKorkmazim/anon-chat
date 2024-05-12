'use client';

import {create} from 'zustand'
import {type MessageItem} from "@/components/main/messages/message";

interface MessagesStore {
    list: {
        [key: string]: MessageItem[]
    }
    setMessageList: (list: { [key: string]: MessageItem[] }) => void
    addMessage: (room: string, message: MessageItem) => void
    initMessage: (room: string) => void
    getList: () => {
        [key: string]: MessageItem[]
    }
}

export const storeMessages = create<MessagesStore>((set, get) => ({
    list: {},
    getList: () => {
        return get().list
    },
    setMessageList: (list) => {
        set(() => ({
            list
        }))
    },

    addMessage: (room, message) => {
        set((state) => {
            if(state.list[room] && state.list[room].length > 99) state.list[room].shift()
            return {
                list: {
                    ...state.list,
                    [room]: [...(state.list[room] ? state.list[room] : []), message]
                }
            }
        })
    },

    initMessage: (room) => {
        set((state) => ({
            list: {
                ...state.list,
                [room]: []
            }
        }))
    }
}))
