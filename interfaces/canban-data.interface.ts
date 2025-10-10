import {Ticket} from "@/interfaces/ticket.interface";

export interface CanbanData {
    _id: string;
    tickets: Ticket[];
}