import {connectToDatabase} from "@lib";
import {TicketModel} from "@models";
import {NextResponse} from "next/server";

await connectToDatabase();
export async function GET(){
    const groupedByStatusTickets = await TicketModel.aggregate([
        {
            $group: {
                _id: "$status",
                tickets: { $push: "$$ROOT" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    return NextResponse.json(groupedByStatusTickets);
}