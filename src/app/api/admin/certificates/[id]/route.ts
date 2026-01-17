import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CertificateRequest from "@/models/CertificateRequest";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const { status } = await req.json();

        const updatedRequest = await CertificateRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        return NextResponse.json({ request: updatedRequest });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
