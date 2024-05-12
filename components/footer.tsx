"use client"

import {storeMe} from "@/store/me";
import {storeUserCount, storeMessageCount} from "@/store/totalCount";

export default function Footer() {
    let me = storeMe();
    let userCount = storeUserCount();
    let messageCount = storeMessageCount();

    return (

        <footer className="flex w-full justify-end text-[11px] text-[#ccc]">
            <div className="flex gap-5 bg-[#ffffff12] rounded p-1 px-2">
                <div>NICK: <span className="text-[#fe4848]">{me.nick ?? "~"}</span></div>
                <div>ONLINE: <span className="text-[#fe4848]">{userCount ? Object.values(userCount).reduce((a, b) => a + b, 0) : "~"}</span></div>
                <div>MESAJ: <span className="text-[#fe4848]">{messageCount ?? "~"}</span></div>
            </div>
        </footer>
    )
}