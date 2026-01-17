import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description: string;
    thumbnail: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    price: number;
    isFree: boolean;
    isFeatured: boolean;
    sections: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        thumbnail: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            default: "beginner",
        },
        price: { type: Number, default: 0 },
        isFree: { type: Boolean, default: false },
        isFeatured: { type: Boolean, default: false },
        sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
    },
    { timestamps: true }
);

const Course: Model<ICourse> =
    mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
