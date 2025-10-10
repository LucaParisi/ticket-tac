import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const config = {
    matcher: ["/secured/:path*"]
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/secured")) {
        try{
            const token = req.cookies.get("token")?.value;
            if(!token) throw new Error("No token");

            await jwtVerify(token, SECRET);
            return NextResponse.next();
        }catch {
            return NextResponse.redirect(new URL("/", req.url));
        }

    }

    return NextResponse.next();
}