'use client';

import {create} from 'zustand'
import type {TabItem} from "@/components/main/tabs/tab";

interface TabStore {
    list: TabItem[]
    active: string
    setList: (list: TabItem[]) => void
    setActiveTab: (shortName: string) => void
    addTab: (tab: TabItem) => void
    deleteTab: (short: string) => void
    getList: () => TabItem[]
    hasTab: (short: string) => boolean
    isRoom: (short: string) => boolean
    isActiveTab: (short: string) => boolean
    setNewTab: (short: string,isNew:boolean) => void
}

export const storeTabs = create<TabStore>((set, get) => ({
    list: [],
    active: '',

    getList: () => {
        return get().list
    },

    hasTab: (short) => {
        return !!get().list.find(e => e.short === short)
    },

    isRoom: (short) => {
        return !!get().list.find(e => e.short === short && e.type === 'room')
    },

    isActiveTab: (short) => {
        return get().active === short
    },

    setList: (list: TabItem[]) => {
        set(() => ({
            list
        }))
    },

    setNewTab: (short,isNew) => {
        set((state) => {
            let list = state.list;

            let findIndex = list.findIndex(e=> e.short === short);
            let findRoom = list[findIndex]

            list[findIndex] = {
                ...findRoom,
                isNew
            }

            return {
                list
            }
        })
    },

    setActiveTab: (shortName) => {
        set(() => ({
            active: shortName
        }))
    },

    addTab: (tab) => {
        set((state) => ({
            list: [...state.list, tab]
        }))
    },

    deleteTab: (short) => {
        set((state) => ({
            list: state.list.filter(e => e.short !== short)
        }))
    }
}))
