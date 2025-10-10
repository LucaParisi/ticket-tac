"use client"

import {useEffect, useState} from "react";
import { ToastEvent } from "@events";
import {XMarkIcon} from "@heroicons/react/24/outline";
import { ToastType } from "@types";

export function Toast() {
    const [visible, setVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<ToastType>(null)

    useEffect(() => {
        const handleCustomEvent = (event: Event) => {
            const customEvent = event as CustomEvent<ToastEvent>;
            setVisible(true);
            const {message, type} = customEvent.detail;
            setMessage(message);
            setType(type);

            const timer = setTimeout(() => {
                setVisible(false);
                setMessage(null);
                setType(null);
            }, 5000);

            return () => clearTimeout(timer);
        };

        window.addEventListener("show-toast", handleCustomEvent);

        return () => {
            window.removeEventListener("show-toast", handleCustomEvent);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed top-5 right-5 z-50">
            <div className={`animate-slide-in toast-base toast-${type}`}>
                <XMarkIcon className="h-6 float-end cursor-pointer" onClick={() => setVisible(false)}/>
                <p className="min-w-96">{message}</p>
            </div>
        </div>
    )
}