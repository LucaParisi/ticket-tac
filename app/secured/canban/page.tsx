"use client"

import {useEffect, useState} from "react";
import {CanbanData} from "@/interfaces/canban-data.interface";
import {InlineSpinner } from "@components";
import {Ticket} from "@interfaces";
import axios from "axios";
import {formatDateFromISOString} from "@/hooks";
import {TICKET_STATUSES} from "@constants";

export default function CanbanPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [canbanDataMap, setCanbanDataMap] = useState<Map<string, Ticket[]>>(new Map<string, Ticket[]>());


    useEffect(() => {
        axios.get('/api/secured/tickets/grouped')
            .then((res) => {
                const _canbanData = res.data as CanbanData[];
                const _canbanDataMap = new Map<string, Ticket[]>()
                _canbanData.forEach(({_id, tickets}: CanbanData) => _canbanDataMap.set(_id, tickets))
                setCanbanDataMap(_canbanDataMap);
                setLoading(false);
            })
    }, []);

    return (
        <div className="py-20 grid grid-cols-5 justify-center content-center p-3">
            {
                TICKET_STATUSES.map(status => (
                    <div key={status} className="p-1">
                        <span className="font-mono text-xl">{status}</span>
                        <div
                            className="mt-2 h-[720px] overflow-y-auto overflow-x-hidden bg-slate-200 rounded px-3 flex flex-col justify-start content-center gap-5 pt-5 relative">
                            {
                                loading ?
                                    <InlineSpinner visible={loading} />

                                    :

                                    canbanDataMap.get(status)?.map((ticket: Ticket) => (
                                        <div key={ticket._id}
                                             className="rounded-xl shadow-sm bg-white border border-gray-300 min-h-20 space-y-2 hover:shadow-lg transition-shadow duration-200">
                                            <span className="p-2 block border-b border-b-gray-300">Title:</span>
                                            <span className="p-2">{ticket.title}</span>
                                            <span className="block p-2 border-b border-b-gray-300">Description</span>
                                            <span className="p-2 text-wrap truncate line-clamp-4">{ticket.description}</span>
                                            <span className="font-medium block text-end text-gray-700 p-2">{formatDateFromISOString(ticket.dueDate)}</span>

                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}