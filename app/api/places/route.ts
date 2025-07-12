import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/places";

export async function GET() {
  await connectToDatabase();

  try {
    const places = await Place.find().sort({ name: 1 });
    return NextResponse.json(places);
  } catch (err) {
    return NextResponse.json({ error: "Ошибка получения заведений" }, { status: 500 });
  }
}
