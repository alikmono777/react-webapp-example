// app/api/coworkers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coworker from "@/models/Coworker";

export async function GET() {
  await connectToDatabase();

  const coworkers = await Coworker.find().sort({ name: 1 });
  return NextResponse.json(coworkers);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { name, role } = await req.json();

  if (!name || !["master", "senior"].includes(role)) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }

  const created = await Coworker.create({ name, role });
  return NextResponse.json(created, { status: 201 });
}
