import {FaTimesCircle} from "react-icons/fa";

import styles from "./index.module.scss"
import {storeTabs} from "@/store/tabs";
import {storeUserCount} from "@/store/totalCount";
import {cn} from "@/lib/utils";

export type TabItem = {
    type: 'room' | 'pm'
    title: string
    image?: any
    default?: boolean
    short: string
    isNew?: boolean
}

interface Props {
    tab: TabItem
    onSelectTab?: (tab: TabItem) => void
    onClosePM?: (tab: TabItem) => void
}


export default function Tab({tab, onSelectTab, onClosePM}: Props) {
    let {active} = storeTabs()
    let userCount = storeUserCount()

    function selectTab() {
        tab.isNew = false
        if (onSelectTab) onSelectTab(tab)
    }

    return (
        <div className={cn(
            'transition cursor-pointer px-2 py-1 flex gap-1 items-center justify-start',
            styles.tab,
            tab.short === active ? styles.active : '',
            tab.isNew ? styles.isNew : ''
        )}
             onClick={selectTab}
        >

            {tab.image && (
                <div className="pr-1">
                    <img src={`/tab-icons/${tab.image}`} alt={""}/>
                </div>
            )}

            <div className="text-gray-300">
                {tab.title}
            </div>

            {tab.type === 'pm' && (
                <div className="pl-2">
                    <FaTimesCircle className="hover:text-red-600 cursor-pointer" onClick={() => onClosePM ? onClosePM(tab) : ''}/>
                </div>
            )}

            {tab.type === 'room' && (
                <div className="text-[11px] text-gray-400">
                    ({userCount && Number.isInteger(userCount[tab.short]) ? userCount[tab.short] : '~'})
                </div>
            )}

        </div>
    )
}