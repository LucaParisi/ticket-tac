import {connectToDatabase} from "@lib";
import { TicketCreation } from "@interfaces";
import {Types} from "mongoose";
import {NextRequest, NextResponse} from "next/server";
import { jwtVerify } from 'jose';
import { TicketModel, UserModel, TicketCommentModel } from '@models'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
await connectToDatabase();

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get('recordId');
    if(!recordId){
        return NextResponse.json({result: false, message: "No recordId provided"});
    }

    const ticket = await TicketModel.findById(recordId);
    if(!ticket){
        return NextResponse.json({result: false, message: "No ticket found!"}, { status: 404 });
    }
    return NextResponse.json(ticket);
}

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get('recordId');
    const newTicket = await req.json() as TicketCreation;
    const token = req.cookies.get("token")?.value || '';
    const jwtPayload = await jwtVerify(token, SECRET);
    const userDetails = jwtPayload.payload;

    if(!userDetails){
        return NextResponse.json({result: false, message: "Could not find user details"}, { status: 422})
    }

    const user = await UserModel.findOne({username: userDetails.username});

    if(!user){
        return NextResponse.json({result: false, message: "Could not find user"}, { status: 422})
    }

    if (!recordId) {
        await TicketModel.create([{ ...newTicket, createdBy: new Types.ObjectId(user._id)}]);
        return NextResponse.json({result: true, message: "Ticket created successfully!"}, { status: 201});
    }

    const {title, status, description} = newTicket;
    await TicketModel.findByIdAndUpdate(recordId, { $set : { title, status, description }});
    return NextResponse.json({result: true, message: "Ticket updated successfully!"}, { status: 201});
}

export async function DELETE(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get('recordId');
    if(!recordId){
        return NextResponse.json({result: false, message: "No record id provided"}, { status: 422 });
    }

    const ticket = await TicketModel.findByIdAndDelete(recordId, { $new: false });
    if(!ticket){
        return NextResponse.json({result: false, message: "No ticket found!"}, {status: 422})
    }
    await TicketCommentModel.deleteMany({ _id: { $in: ticket.comments } })
    return NextResponse.json({result: true, message: "Ticket deleted successfully!"});
}