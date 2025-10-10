export interface TicketQuery {
    title?: { $regex: RegExp };
    status?: { $regex: RegExp };
    dueDate?: { $lt: Date };
}