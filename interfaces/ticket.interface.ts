import {User} from "./user.interface";

export interface Ticket {
    _id: string;
    title: string;
    description: string;
    comments: string[];
    status: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: User;
}