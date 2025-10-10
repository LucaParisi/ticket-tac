import {connectToDatabase} from "@lib";
import { UserModel } from "@models";
import bcrypt from "bcrypt";
import { Credentials } from "@interfaces";
import {NextResponse} from "next/server";
await connectToDatabase();
import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request){
    const { username, password } = await req.json() as Credentials;
    const user = await UserModel.findOne({ $or: [ {username : { $regex: new RegExp(username), $options: 'i'}}, {email : { $regex: new RegExp(username), $options: 'i'}}]});
    if(!user){
        return Response.json({ result: false, message: "Invalid credentials" }, {status: 401});
    }

    if(!bcrypt.compareSync(password, user.password)){
        return Response.json({ result: false, message: "Invalid credentials" }, {status: 401});
    }

    const jwtPayload = { userId: user._id, username: user.username };
    const access_token = await new SignJWT(jwtPayload)
        .setProtectedHeader({ alg: "HS256" })  // same algorithm we verify with
        .setIssuedAt()
        .setExpirationTime("24h")              // or '2h', '7d', etc.
        .sign(SECRET);

    const res = NextResponse.json({ access_token }, {status: 201});

    res.cookies.set("token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });

    return res;
}