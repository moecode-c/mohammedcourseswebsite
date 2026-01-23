import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        if (!supabaseAdmin) {
            return NextResponse.json({ error: "Supabase admin client is not configured. Check SUPABASE_SERVICE_ROLE_KEY." }, { status: 500 });
        }
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;

        const { data, error } = await supabaseAdmin.storage
            .from("coursespictures")
            .upload(filename, Buffer.from(buffer), {
                contentType: file.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase Upload Error:", error);
            return NextResponse.json({ error: "Upload to storage failed." }, { status: 500 });
        }

        // Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from("coursespictures")
            .getPublicUrl(filename);

        return NextResponse.json({
            success: true,
            url: publicUrl
        });

    } catch (error) {
        console.error("General Upload Error:", error);
        return NextResponse.json({ error: "Upload process failed." }, { status: 500 });
    }
}
