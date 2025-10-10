"use client"

import {ArrowLeftStartOnRectangleIcon, Cog6ToothIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import axios from "axios";
import TICKET_TAC_WHITE_ICON from '@/public/icons/outline/white/ticket-tac.png';
import Image from "next/image";

export function Navbar () {
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const router = useRouter();
    let timer: NodeJS.Timeout | null = null;
    const currentPathName = usePathname().split('/').pop();

    const hidePopoverAsync = () => {
        timer = setTimeout(() => {
            setIsSettingsOpen(false)
        }, 500);
    }

    const keepPopover = () => {
        if(timer) clearTimeout(timer)
        setIsSettingsOpen(true)
    }

    const logout = async () => {
        const res = await axios.get('/api/auth/logout', {withCredentials: true})
        if(res.status === 200) {
            router.replace('/')
        }
    }

    return (
        <header className="bg-orange-500 rounded-b shadow-sm w-full h-17 fixed top-0 text-white p-4 font-bold z-10">
            <div className="flex flex-row justify-between content-between px-30">

                <div className="flex flex-row justify-between content-between gap-x-10">
                    <Image src={TICKET_TAC_WHITE_ICON} className="pt-3" alt="Ticket-tac!"/>

                    <h1>Ticket-tac!</h1>
                </div>

                <div className="flex flex-row justify-betweeen content-between gap-x-10">
                    <h2 className={`hover:opacity-75 cursor-pointer pb-7 ${currentPathName === 'home' && 'border-b-2 border-b-white'}`} onClick={() => router.push('/secured/home')}>
                        GRID
                    </h2>

                    <h2 className={`hover:opacity-75 cursor-pointer pb-7 ${currentPathName === 'canban' && 'border-b-2 border-b-white'}`} onClick={() => router.push('/secured/canban')}>
                        CANBAN
                    </h2>
                </div>

                <div className="relative cursor-pointer" onMouseLeave={hidePopoverAsync}>
                    <Cog6ToothIcon className="h-10 pt-4 hover:opacity-75 cursor-pointer"
                                   onClick={() => setIsSettingsOpen(true)}/>

                    {isSettingsOpen && (
                        <div className="absolute top-18 -left-22 z-10 flex w-80 max-w-max -translate-x-1/2 px-4">
                            <div className="bg-white rounded -top-1 right-12 -z-10 absolute rotate-45 size-10"></div>
                            <div
                                className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm ring-1 shadow-lg ring-gray-900/5 p-3">
                                <button
                                    onMouseEnter={keepPopover}
                                    className="hover:bg-orange-500/10 border-none hover:opacity-75 cursor-pointer p-4 rounded-lg text-lg font-bold w-full"
                                    onClick={logout}
                                >
                                <span
                                    className="flex flex-row justify-between content-between gap-7 text-md font-semibold text-gray-900">
                                    <ArrowLeftStartOnRectangleIcon className="h-6"/>
                                    Logout
                                </span>

                                </button>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </header>
    )
}