import mongoose, {model, models, Types} from 'mongoose';

const TicketCommentSchema = new mongoose.Schema({
        title: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: true
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
            required: true
        }

    },
    { timestamps: true }
);

const TicketCommentModel = models.TicketComment || model("TicketComment", TicketCommentSchema);

export { TicketCommentModel };