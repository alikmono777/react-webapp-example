"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Coworker = {
  _id: string;
  name: string;
  role: "master" | "senior";
};

export default function CoworkerListPage() {
  const [coworkers, setCoworkers] = useState<Coworker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/coworkers")
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка запроса");
        return res.json();
      })
      .then(setCoworkers)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (error)
    return <p className="text-red-500 text-center p-6">❌ Ошибка загрузки</p>;

  if (loading)
    return <p className="text-white text-center p-6">Загрузка...</p>;

  return (
    <div className="flex min-h-screen flex-col items-center gap-2 p-2 md:p-10 lg:p-24 central-block">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-[#f5c26b] mb-4">Сотрудники</h1>

        <div className="mb-6">
          <Link
            href="/coworkers/new"
            className="inline-block border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-semibold px-6 py-2 rounded-xl text-sm transition"
          >
            ➕ Добавить сотрудника
          </Link>
        </div>

        <ul className="space-y-4">
          {coworkers.map((c) => (
            <li
              key={c._id}
              className="p-6 border border-[#f5c26b]/30 rounded-xl bg-[#1a1a1a] shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-lg">{c.name}</div>
                  <div className="text-sm text-gray-400">
                    {c.role === "senior"
                      ? "Старший кальянный мастер"
                      : "Кальянный мастер"}
                  </div>
                </div>

                <Link
                  href={`/coworkers/${c._id}/salary`}
                  className="border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-medium px-4 py-1.5 rounded-xl text-sm transition"
                >
                  💰 Отчёт по зарплате
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
