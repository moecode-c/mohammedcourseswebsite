import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AccessRequest from "@/models/AccessRequest";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: courseId } = await params;
        const { fullName, phoneNumber, transactionNotes } = await req.json();

        if (!fullName || !phoneNumber) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check for existing pending request
        const existing = await AccessRequest.findOne({
            userId: payload.userId,
            courseId,
            status: "pending",
        });

        if (existing) {
            return NextResponse.json(
                { error: "Pending request already exists" },
                { status: 400 }
            );
        }

        const request = await AccessRequest.create({
            userId: payload.userId,
            courseId,
            status: "pending",
            paymentDetails: {
                fullName,
                phoneNumber,
                transactionNotes,
            },
        });

        return NextResponse.json({ request }, { status: 201 });
    } catch (error) {
        console.error("Unlock Request Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
