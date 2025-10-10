import {NextRequest, NextResponse} from "next/server";
import {TicketCommentModel} from "@models";
import {connectToDatabase} from "@lib";

await connectToDatabase();

export async function GET(){
    const comments = await TicketCommentModel.find();
    return NextResponse.json(comments);
}

export async function POST(req: NextRequest){
    const commentIds = await req.json() as string[];
    const comments = await TicketCommentModel.find({ _id: { $in : commentIds}})
                                                    .populate('createdBy', 'firstName lastName email username -_id');
    
    return NextResponse.json(comments);
}