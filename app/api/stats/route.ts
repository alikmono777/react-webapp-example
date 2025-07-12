import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Shift from "@/models/Shift";
import Place from "@/models/places";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("place");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!placeId || !from || !to) {
    return NextResponse.json({ error: "place, from и to обязательны" }, { status: 400 });
  }

  const place = await Place.findOne({ uniqueId: placeId });
  if (!place || !place.hookahs) {
    return NextResponse.json({ error: "Заведение не найдено или нет цен" }, { status: 404 });
  }

  const hookahPrices: Record<string, number> = {};
  for (const [key, value] of place.hookahs.entries()) {
    hookahPrices[key] = value.price;
  }

  const shifts = await Shift.find({
    placeId,
    date: { $gte: from, $lte: to },
  });

  const totalByCategory: Record<string, number> = {};
  const revenueByCategory: Record<string, number> = {};
  const dailyMap: Record<string, number> = {};
  let totalHookahs = 0;
  let totalRevenue = 0;

  for (const shift of shifts) {
    const sales = shift.sales instanceof Map
      ? Object.fromEntries(shift.sales.entries())
      : shift.sales || {};

    const date = shift.date;

    const dayTotal = Object.entries(sales).reduce((sum, [cat, qty]) => {
      totalByCategory[cat] = (totalByCategory[cat] || 0) + qty;
      revenueByCategory[cat] = (revenueByCategory[cat] || 0) + (qty * (hookahPrices[cat] || 0));
      return sum + qty;
    }, 0);

    const dayRevenue = Object.entries(sales).reduce(
      (sum, [cat, qty]) => sum + (hookahPrices[cat] || 0) * qty,
      0
    );

    totalHookahs += dayTotal;
    totalRevenue += dayRevenue;
    dailyMap[date] = (dailyMap[date] || 0) + dayTotal;
  }

  const dailyChart = Object.entries(dailyMap).map(([date, total]) => ({ date, total }));

  return NextResponse.json({
    totalByCategory,
    revenueByCategory,
    totalHookahs,
    totalRevenue,
    dailyChart,
  });
}