'use client';

import {create} from 'zustand'

interface UserCountStore {
    [key: string]: number
}

export const storeUserCount = create<UserCountStore | null>(() => null)
export const storeMessageCount = create<number | null>(() => null)