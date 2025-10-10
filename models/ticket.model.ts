import mongoose, {Types} from 'mongoose';
import { UserModel } from "@models";

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'PENDING',
    },
    comments: [{
        type: Types.ObjectId,
        ref: 'TicketComment'
    }],
    createdBy: {
        type: Types.ObjectId,
        ref: UserModel.modelName,
        required: true
    },
    dueDate: {
        type: Date,
        default: Date.now
    }

},
    { timestamps: true }
);

const TicketModel = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

export { TicketModel };