import mongoose from "mongoose";
import User from "../models/User";
import Course from "../models/Course";
import Section from "../models/Section";
import AccessRequest from "../models/AccessRequest";
import Badge from "../models/Badge";
import dbConnect from "../lib/db";
import { hashPassword } from "../lib/auth";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Helper to run seed
async function seed() {
    console.log("🌱 Starting Database Seed...");

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear Database
    await User.deleteMany({});
    await Course.deleteMany({});
    await Section.deleteMany({});
    await AccessRequest.deleteMany({});
    await Badge.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create Users
    const studentPassword = await hashPassword("password123");
    const adminPassword = await hashPassword("admin123");

    const admin = await User.create({
        name: "System Administrator",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin",
        xp: 9999,
        level: 100,
    });

    const student = await User.create({
        name: "Ready Player One",
        email: "student@example.com",
        password: studentPassword,
        role: "student",
        xp: 50,
        level: 1,
    });

    console.log("👥 Users Created: Admin & Student");

    // Create Courses
    const freeCourse = await Course.create({
        title: "Intro to Cyberpunk Coding",
        description: "Learn the basics of the grid. Survive the net. Free entry for all neon runners.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        difficulty: "beginner",
        price: 0,
        isFree: true,
        languages: ["HTML", "CSS"],
    });

    const paidCourse = await Course.create({
        title: "Mastering the Matrix",
        description: "Advanced techniques for high-level operatives. Payment required. Clearance restricted.",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
        difficulty: "advanced",
        price: 500,
        isFree: false,
        isFeatured: true,
        languages: ["React", "TypeScript", "Node.js"],
    });

    console.log("📚 Courses Created");

    // Create Sections for Free Course
    const s1 = await Section.create({
        courseId: freeCourse._id,
        title: "The Awakening",
        content: "Welcome to the digital frontier. In this section, we will explore the basics of HTML5 and Semantics.\n\n### Your First Element\n\n```html\n<h1>Hello Night City</h1>\n```\n\nUnderstand this, and you understand the layout of the web.",
        isFree: true,
        order: 1,
    });

    const s2 = await Section.create({
        courseId: freeCourse._id,
        title: "Styling the Void",
        content: "CSS is the paint for your canvas. Learn to manipulate colors, layout, and responsiveness.\n\nUse the `flex` property to align your thoughts.",
        isFree: true,
        order: 2,
    });

    // Link sections to course
    freeCourse.sections.push(s1._id, s2._id);
    await freeCourse.save();

    // Create Sections for Paid Course
    const s3 = await Section.create({
        courseId: paidCourse._id,
        title: "Red Pill or Blue Pill?",
        content: "This content is locked behind a paywall. If you are reading this, you have clearance.\n\nReact Hooks are the red pill.",
        isFree: false, // Locked even if course is free (though this course is paid)
        order: 1,
    });

    paidCourse.sections.push(s3._id);
    await paidCourse.save();

    console.log("📄 Sections Created");

    // Create Example Access Request
    await AccessRequest.create({
        userId: student._id,
        courseId: paidCourse._id,
        status: "pending",
        paymentDetails: {
            fullName: "Wade Watts",
            phoneNumber: "01010101010",
            transactionNotes: "Sent via Instapay",
        },
    });

    console.log("✉️ Access Request Created");
    console.log("🌱 Seed Complete!");

    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
