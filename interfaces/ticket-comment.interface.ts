import {User} from "@/interfaces/user.interface";

export interface TicketComment {
    _id: string;
    title: string;
    description: string;
    createdBy: User;
    createdAt: string;
}