import styles from "./index.module.scss"
import type {Socket} from "socket.io-client";
import {type FormEvent, useState, forwardRef, type ReactNode} from "react";
import {storeTabs} from "@/store/tabs";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";

interface Props {
    children?: ReactNode
    socket?: Socket,
}

export default forwardRef<HTMLInputElement, Props>(function SubmitInput({socket}: Props, ref) {
    let [text, setText] = useState<string>('');
    let {active} = storeTabs()

    function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!socket) return;
        if (!text) return;

        socket.emit('message.send', {
            room: active,
            text
        })
        setText('')
    }

    let SubmitInputSkeleton = () => (
        <>
            <Skeleton className="w-full h-full"/>
        </>
    )

    return (
        <form className="border-t border-[#222] pt-2 h-11" onSubmit={sendMessage}>
            {!socket ? (
                <SubmitInputSkeleton/>
            ) : (
                <input
                    ref={ref}
                    type="text"
                    placeholder="mesaj..."
                    className={cn(
                        'w-full border-0 bg-transparent bg-no-repeat bg-left text-2xl pl-10 outline-none',
                        styles.submitInput
                    )}
                    value={text}
                    autoFocus
                    onChange={e => setText(e.target.value)}
                />
            )}
        </form>
    )
})