import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, courseId, mediaType = "image" } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 });
    }

    // Extract public_id from the image URL
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-zA-Z0-9]+$/);
    const publicId = matches?.[1];
    if (!publicId) {
      return NextResponse.json(
        { error: "Could not extract public_id from URL" },
        { status: 400 },
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey =
      process.env.CLOUDINARY_API_KEY ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret =
      process.env.CLOUDINARY_API_SECRET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials missing" },
        { status: 500 },
      );
    }

    // Delete from Cloudinary (use mediaType for endpoint)
    const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/${mediaType}/upload`;
    const res = await fetch(destroyUrl, {
      method: "DELETE",
      headers: {
        Authorization: "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_ids: [publicId] }),
    });
    if (!res.ok) {
      let error;
      try {
        error = await res.json();
      } catch {
        error = { error: { message: "Failed to delete media" } };
      }
      return NextResponse.json(
        { error: error.error?.message || "Failed to delete media" },
        { status: 500 },
      );
    }

    // If courseId is provided, update the correct field
    if (courseId) {
      const updateField = mediaType === "video" ? { demoVideo: "" } : { thumbnail: "" };
      await prisma.course.update({
        where: { id: courseId },
        data: updateField,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    let message = "Server error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
