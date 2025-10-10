import { UserModel } from "@models";
import {PersonDetail} from "@interfaces";
import {connectToDatabase} from "@lib";
import bcrypt from "bcrypt";

await connectToDatabase();

export async function POST(req: Request) {
    const personDetail = await req.json() as PersonDetail;
    personDetail.password = bcrypt.hashSync(btoa(personDetail.password), 12);
    await UserModel.create([{...personDetail}]);
    return Response.json({
        result: true,
        message: 'User created successfully!'
    })
}