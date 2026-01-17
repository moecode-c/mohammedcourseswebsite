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
    content: string; // Markdown
    videoUrl?: string; // YouTube link
    pdfUrl?: string; // Google Drive link
    isFree: boolean;
    order: number;
    quiz?: IQuiz;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
});

const SectionSchema: Schema<ISection> = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        videoUrl: { type: String },
        pdfUrl: { type: String },
        isFree: { type: Boolean, default: false },
        order: { type: Number, required: true },
        quiz: {
            questions: [QuestionSchema],
            passScore: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

const Section: Model<ISection> =
    mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);

export default Section;
