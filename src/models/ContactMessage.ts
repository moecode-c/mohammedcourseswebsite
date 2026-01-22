import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    email: string;
    message: string;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        source: { type: String, required: true, default: "tutorial" },
    },
    { timestamps: true }
);

const ContactMessage: Model<IContactMessage> =
    mongoose.models.ContactMessage ||
    mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
