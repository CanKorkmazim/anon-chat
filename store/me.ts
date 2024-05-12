'use client';

import { create } from 'zustand'

export const storeMe = create(() => ({
    id: null,
    nick: null
}))