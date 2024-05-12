import Tab, {TabItem} from "./tab"
import {storeTabs} from "@/store/tabs";
import {type Socket} from "socket.io-client";
import {type RefObject} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";

interface Props {
    socket?: Socket,
    submitInputRef: RefObject<HTMLInputElement>
}

export default function Tabs({socket, submitInputRef}: Props) {
    let {list: tabs, setActiveTab, active, deleteTab} = storeTabs();

    function onSelect(tab: TabItem) {
        if (!socket) return;
        if (active === tab.short) return

        socket.emit('room.join', tab.short);
        setActiveTab(tab.short)
        submitInputRef.current?.focus()
    }

    function onClosePM(tab: TabItem) {
        deleteTab(tab.short)
        let defaultTab = tabs.find(e => e.default);


        if (defaultTab) setActiveTab(defaultTab.short)
    }

    let TabSkeleton = () => (
        <>
            <Skeleton className="w-32 h-[26px]"/>
            <Skeleton className="w-32 h-[26px]"/>
            <Skeleton className="w-32 h-[26px]"/>
            <Skeleton className="w-32 h-[26px]"/>
        </>
    )

    return (
        <div className={cn('tabs flex gap-1 flex-wrap')}>
            {(!tabs.length || !socket)
                ? (<TabSkeleton/>)
                : (tabs.map((tab, key) => (
                    <Tab
                        tab={tab}
                        key={key}
                        onSelectTab={onSelect}
                        onClosePM={onClosePM}
                    />
                )))
            }
        </div>
    )
}