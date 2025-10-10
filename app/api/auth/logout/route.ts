import {NextResponse} from "next/server";

export function GET(){
    const res = NextResponse.json({ status: 200});
    res.cookies.delete({
        name: "token",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    return res;
}