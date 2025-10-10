import {connectToDatabase} from "@lib";
import { TicketModel } from "@models";
import {NextResponse} from "next/server";
import {DateTime} from "luxon";

await connectToDatabase();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") ?? "";
    const status = searchParams.get("status") ?? "";
    const orderBy = searchParams.get("orderBy") ?? "createdAt";
    const dueDateString = searchParams.get("dueDate") ?? "31-12-9999";

    let dueDate: Date;
    try {
        dueDate = DateTime.fromFormat(dueDateString, "dd-MM-yyyy").toJSDate();
    } catch (err) {
        dueDate = new Date("9999-12-31");
    }

    console.log(orderBy)
    const query: any = {};
    if (title) query.title = { $regex: new RegExp(title, "i") };
    if (status) query.status = { $regex: new RegExp(status, "i") };
    if (dueDate) query.dueDate = { $lt: dueDate };

    const results = await TicketModel.find(query)
        .populate("createdBy", "firstName lastName email username -_id")
        .sort({ [orderBy]: -1 });

    return NextResponse.json(results);
}