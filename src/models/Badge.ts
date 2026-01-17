import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBadge extends Document {
    id: string; // Custom ID like 'first-steps'
    name: string;
    description: string;
    icon: string; // Lucide icon name or image URL
    criteria: string; // Description of how to get it (internal logic identifier)
    xpValid: number; // Optional: XP bonus for getting the badge
}

const BadgeSchema: Schema<IBadge> = new Schema(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        criteria: { type: String, required: true },
        xpValid: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Badge: Model<IBadge> =
    mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema);

export default Badge;
