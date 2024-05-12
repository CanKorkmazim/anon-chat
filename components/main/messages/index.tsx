import Message, {MessageItem} from "./message"
import {storeMessages} from "@/store/messages";
import {storeTabs} from "@/store/tabs";
import {storeMe} from "@/store/me";
import {Skeleton} from "@/components/ui/skeleton";
import {type ReactNode, type RefObject, useEffect} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

interface Props {
    children?: ReactNode
    submitInputRef: RefObject<HTMLInputElement>
    messagesScrollRef: RefObject<HTMLDivElement>
}

export default function Messages({submitInputRef, messagesScrollRef}: Props) {
    let {list, initMessage} = storeMessages()
    let {active, addTab, hasTab, setActiveTab} = storeTabs()
    let me = storeMe()

    let MessageSkeleton = () => (
        <div className="message flex justify-between h-8 items-center px-2">
            <div className="flex gap-2 items-center">
                <Skeleton className="w-6 h-6 rounded-full"/>

                <Skeleton className="w-6 h-4"/>

                <Skeleton className="w-80 h-4"/>
            </div>

            <Skeleton className="w-20 h-4"/>
        </div>
    )

    function openPM(message: MessageItem) {
        if (message.userNick === me.nick) return;

        if (!hasTab(message.userNick)) addTab({
            type: 'pm',
            title: message.userNick,
            short: message.userNick,
        })

        if (!list[message.userNick]) initMessage(message.userNick)

        setActiveTab(message.userNick)
        submitInputRef.current?.focus()
    }

    function messagesScrollToBottom() {
        if (messagesScrollRef.current) {
            let scrollAreaViewport = messagesScrollRef.current.querySelector('[data-radix-scroll-area-viewport]');

            if (scrollAreaViewport) {
                scrollAreaViewport.scrollTo(0, scrollAreaViewport.scrollHeight)
            }
        }
    }

    useEffect(messagesScrollToBottom, [list, active]);

    return (
        <ScrollArea className="h-[60vh] pr-3" type="auto" ref={messagesScrollRef}>
            <div className={cn('messages flex-col gap-1 flex shrink-0')}>
                {!Array.isArray(list[active])
                    ? (<>
                        <MessageSkeleton/>
                        <MessageSkeleton/>
                        <MessageSkeleton/>
                    </>)
                    : list[active].map((content, key) => (<Message content={content} key={key} openPM={openPM}/>))
                }
            </div>
        </ScrollArea>
    )
}