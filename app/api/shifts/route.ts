import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Shift from "@/models/Shift";
import Coworker from "@/models/Coworker";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place");

  if (!placeId) {
    return NextResponse.json({ error: "Не указан параметр place" }, { status: 400 });
  }

  const shifts = await Shift.find({ placeId }).sort({ date: -1 });

  // загрузим имена сотрудников
  const coworkerMap = new Map<string, string>();
  // собрать id всех сотрудников
  const allIds = new Set<string>();

  shifts.forEach((shift) => {
    shift.coworkers.forEach((c) => {
      if (c?.coworkerId) allIds.add(c.coworkerId.toString());
    });

    if (shift.coalman?.coworkerId) {
      allIds.add(shift.coalman.coworkerId.toString());
    }
  });


  const coworkers = await Coworker.find({ _id: { $in: [...allIds] } });
  coworkers.forEach((c) => coworkerMap.set(c._id.toString(), c.name));

  // добавим имена в ответ
  const response = shifts.map((shift) => ({
    _id: shift._id,
    date: shift.date,
    sales: shift.sales,
    coworkers: (shift.coworkers || []).map((c: any) => {
      const coworkerId = c?.coworkerId?.toString?.();
      const name = coworkerId ? coworkerMap.get(coworkerId) || "—" : "—";
      return {
        ...((typeof c.toObject === "function" ? c.toObject() : c) || {}),
        name,
      };
    }),
    coalman: shift.coalman?.coworkerId
      ? {
          ...shift.coalman,
          name:
            coworkerMap.get(shift.coalman.coworkerId.toString?.() || "") || "—",
        }
      : null,
  }));
  

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const {
    placeId,
    date,
    coworkers,
    sales,
    coalman,
  }: {
    placeId: string;
    date: string;
    coworkers: { coworkerId: string; role: "master" | "senior" }[];
    sales: Record<string, number>;
    coalman?: { coworkerId: string; fixedSalary: number } | null;
  } = await req.json();

  if (!placeId || !date || !Array.isArray(coworkers)) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }

  if (coworkers.length === 0 || coworkers.length > 2) {
    return NextResponse.json({ error: "В смене должно быть 1–2 сотрудника" }, { status: 400 });
  }

  const allIds = coworkers.map((c) => c.coworkerId);
  if (coalman?.coworkerId) allIds.push(coalman.coworkerId);

  const uniqueIds = new Set(allIds);
  if (uniqueIds.size !== allIds.length) {
    return NextResponse.json(
      { error: "Один и тот же сотрудник не может быть назначен дважды" },
      { status: 400 }
    );
  }

  const existing = await Shift.findOne({ placeId, date });
  if (existing) {
    return NextResponse.json(
      { error: "Смена на эту дату уже существует" },
      { status: 400 }
    );
  }

  const created = await Shift.create({
    placeId,
    date,
    coworkers,
    sales,
    coalman: coalman || null,
  });

  return NextResponse.json(created, { status: 201 });
}
