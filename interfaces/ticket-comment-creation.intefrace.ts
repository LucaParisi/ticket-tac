import {User} from "@/interfaces/user.interface";

export interface TicketCommentCreation {
    title: string;
    description: string;
    createdBy: User;
}