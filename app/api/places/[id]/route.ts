import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Place from "@/models/places";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  try {
    const place = await Place.findOne({ uniqueId: params.id });
    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json(place);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при получении заведения" }, { status: 500 });
  }
}


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();
  const data = await req.json();

  try {
    const updated = await Place.findOneAndUpdate(
      { uniqueId: params.id },   // ← ключевой момент!
      data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Заведение не найдено" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Ошибка при обновлении" }, { status: 500 });
  }
}
