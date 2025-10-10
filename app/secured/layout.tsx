"use client";

import { PropsWithChildren } from "react";
import {Toast} from "@/components/toast.component";
import {Navbar} from "@/components/navbar.component";
import {Footer} from "@components";

export default function SecuredLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Toast />
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <main className="py-24">
                    {children}
                </main>
            </div>
            <Footer />
        </>
    );
}