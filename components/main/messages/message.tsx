import {storeMe} from "@/store/me";
import {cn} from "@/lib/utils";
import moment from "moment";

export type MessageItem = {
    userId: string
    userNick: string
    text: string
    date: string
}

interface Props {
    content: MessageItem,
    openPM: (a: MessageItem) => void
}

export default function Message({content, openPM}: Props) {
    let me = storeMe();
    let isMe = me.nick === content.userNick;

    return (
        <div className={cn('message flex justify-between bg-[#151515] hover:bg-[#ffffff05] h-8 items-center px-2 shrink-0',)}>
            <div className="flex gap-2 items-center">
                <div className={cn(isMe ? 'text-blue-400' : 'text-[#e47272]', !isMe ? 'cursor-pointer' : '')} onClick={() => openPM(content)}>
                    {content.userNick}
                </div>

                <div className="text-[#ccc]">{content.text}</div>
            </div>

            <div>{moment(content.date).format('HH:mm')}</div>
        </div>
    )
}