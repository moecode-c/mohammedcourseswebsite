import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactMessage extends Document {
    name: string;
    phone: string;
    message: string;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        source: { type: String, required: true, default: "tutorial" },
    },
    { timestamps: true }
);

if (mongoose.models.ContactMessage) {
    delete mongoose.models.ContactMessage;
}

const ContactMessage: Model<IContactMessage> =
    mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
