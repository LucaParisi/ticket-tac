import {NextRequest, NextResponse} from "next/server";
import {connectToDatabase} from "@lib";
import {TicketComment, TicketCommentCreation} from "@interfaces";
import { TicketModel, TicketCommentModel, UserModel } from "@models";
import { jwtVerify } from 'jose';
import {Types} from "mongoose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
await connectToDatabase();

export async function GET(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('recordId');
    if(!commentId){
        return NextResponse.json({result: false, message: "No comment Id provided"});
    }

    const comment = await TicketCommentModel.findById(commentId);
    if(!comment){
        return NextResponse.json({result: false, message: "Comment not found"}, {status: 404});
    }

    return NextResponse.json(comment);
}

export async function POST(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticketId');

    if(!ticketId){
        return NextResponse.json({result: false, message: "No ticket Id provided"});
    }

    const token = req.cookies.get("token")?.value || '';
    const decodedJwt = await jwtVerify(token, SECRET);
    const userDetails = decodedJwt.payload;

    if(!userDetails){
        return NextResponse.json({result: false, message: "Could not find user details"}, { status: 422})
    }

    const user = await UserModel.findOne({username: userDetails.username});

    if(!user){
        return NextResponse.json({result: false, message: "Could not find user"}, { status: 422})
    }

    const payload = await req.json() as TicketComment;

    let comment;
    if(payload._id) {
        const { title, description } = payload;
        comment = await TicketCommentModel.findByIdAndUpdate(payload._id, { $set : { title, description} }, { $new: true });
        if(!comment){
            return NextResponse.json({ result: false, message: 'Something went wrong' }, { status: 422 });
        }
    }else {
        comment = await TicketCommentModel.create({ ...payload, createdBy: new Types.ObjectId(user._id)});
        if(!comment){
            return NextResponse.json({ result: false, message: 'Something went wrong' }, { status: 422 });
        }
    }

    await TicketModel.findByIdAndUpdate(ticketId, { $push: { comments : comment._id }});

    return NextResponse.json({ result: true, message: 'Successfully created new comment'})
}

export async function DELETE(req: NextRequest){
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('recordId');
    const ticketId = searchParams.get('ticketId');

    if(!commentId){
        return NextResponse.json({result: false, message: "No Comment Id provided"});
    }

    const commentToDelete = await TicketCommentModel.findOneAndDelete({_id: commentId}, { $new: false });

    if(!commentToDelete){
        return NextResponse.json({result: false, message: "Comment not found!"});
    }

    await TicketModel.findByIdAndUpdate(ticketId, { $pull: { comments : commentId }});
    return NextResponse.json({ result: true, message: 'Successfully deleted comment'})
}