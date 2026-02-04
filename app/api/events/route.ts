import { Event } from "@/database";
import connectDb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());

    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    // upload image FIRST
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "DevEvent" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    // attach image URL
    event.image = uploadResult.secure_url;

    // now save to DB
    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event creation failed",
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 }
    );
  }
}


export async function GET () {
    try {
        await connectDb()
        const events = await Event.find().sort({createdAt: -1})
        return NextResponse.json({message: "Events fetched successfully!", events}, {status: 200})
    } catch (e) {
        return NextResponse.json({messge: "Event fetching failed", error: e}, {status: 500})
    }
}