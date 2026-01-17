import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion {
    questionText: string;
    options: string[];
    correctOptionIndex: number;
}

export interface IQuiz {
    questions: IQuestion[];
    passScore: number; // e.g., 70% or absolute number
}

export interface ISection extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    content: string; // Markdown or description
    type: "text" | "video" | "quiz" | "link";
    videoUrl?: string; // For video type
    linkUrl?: string; // For link type (PDF, Drive, etc)
    questions?: {
        questionText: string;
        options: string[];
        correctOptionIndex: number;
    }[]; // For quiz type
    isFree: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const SectionSchema: Schema<ISection> = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        content: { type: String, default: "" },
        type: {
            type: String,
            enum: ["text", "video", "quiz", "link"],
            default: "text"
        },
        videoUrl: { type: String },
        linkUrl: { type: String },
        questions: [{
            questionText: String,
            options: [String],
            correctOptionIndex: Number
        }],
        isFree: { type: Boolean, default: false },
        order: { type: Number, required: true },
    },
    { timestamps: true }
);

const Section: Model<ISection> =
    mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);

export default Section;
