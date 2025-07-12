"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const categories = [
  "lite",
  "standart",
  "premium",
  "grapefruitbowl",
  "pineapplebowl",
  "special",
];

export default function StatisticsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stats?place=${id}&from=${from}&to=${to}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError("Ошибка загрузки статистики");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (from && to) fetchStats();
  }, [from, to]);

  return (
    <div className="text-white px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-[#f5c26b] mb-4">
        Статистика заведения #{id}
      </h1>

      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-sm mb-1">С даты</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">По дату</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
          />
        </div>
      </div>

      {loading && <p className="text-white">Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#f5c26b] mb-2">Суммарно продано кальянов</h2>
            <ul className="list-disc ml-4 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  {cat}: {stats.totalByCategory?.[cat] || 0} шт. — {stats.revenueByCategory?.[cat] || 0}₾
                </li>
              ))}
              <li className="mt-2 font-semibold">
                Всего: {stats.totalHookahs || 0} шт.
              </li>
              <li className="font-semibold">
                Общая выручка: {stats.totalRevenue || 0}₾
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#f5c26b] mb-2">
              Динамика по дням
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stats.dailyChart || []}>
                <XAxis dataKey="date" stroke="#ccc" fontSize={12} />
                <YAxis stroke="#ccc" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#2a2a2a", color: "#fff" }} />
                <Line type="monotone" dataKey="total" stroke="#f5c26b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}