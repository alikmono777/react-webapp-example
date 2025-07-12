"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const formatDate = (dateStr: string) => {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year} года (${day}.${month}.${year})`;
};

export default function ShiftListPage() {
  const { id } = useParams();
  const [shifts, setShifts] = useState<any[]>([]);
  const [placeData, setPlaceData] = useState<any>(null);
  const [coworkerFilter, setCoworkerFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [coworkerNames, setCoworkerNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [shiftRes, placeRes] = await Promise.all([
          fetch(`/api/shifts?place=${id}`),
          fetch(`/api/places/${id}`),
        ]);

        const [shiftsData, placeSettings] = await Promise.all([
          shiftRes.json(),
          placeRes.json(),
        ]);

        setShifts(shiftsData);
        setPlaceData(placeSettings);

        // собрать имена сотрудников для фильтра
        const allNames = new Set<string>();
        shiftsData.forEach((s: any) =>
          s.coworkers.forEach((c: any) => allNames.add(c.name))
        );
        setCoworkerNames(Array.from(allNames));
      } catch (err) {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (loading || !placeData) return <p className="text-white p-6">Загрузка...</p>;

  // фильтрация смен по имени или дате
  const filteredShifts = shifts.filter((shift) => {
    const inSearch =
      formatDate(shift.date).toLowerCase().includes(searchQuery.toLowerCase());
    const byCoworker =
      coworkerFilter === "all" ||
      shift.coworkers.some((c: any) => c.name === coworkerFilter);
    return inSearch && byCoworker;
  });

  return (
    <div className="text-white px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-[#f5c26b] mb-4">
        Смены заведения #{id}
      </h1>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          href={`/places/${id}/shifts/new`}
          className="border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-semibold px-6 py-2 rounded-xl text-sm transition text-center"
        >
          ➕ Добавить смену
        </Link>

        <input
          type="text"
          placeholder="Поиск по дате..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-[#f5c26b]">Фильтр по сотруднику</label>
        <select
          value={coworkerFilter}
          onChange={(e) => setCoworkerFilter(e.target.value)}
          className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
        >
          <option value="all">Все сотрудники</option>
          {coworkerNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {filteredShifts.length === 0 && (
        <p className="text-sm text-gray-400">Нет смен по фильтрам</p>
      )}

      <ul className="space-y-4">
        {filteredShifts.map((shift) => {
          const hasSenior = shift.coworkers.some((c: any) => c.role === "senior");

          const totalSales = Object.entries(shift.sales).reduce(
            (sum, [, qty]) => sum + qty,
            0
          );

          const totalRevenue = Object.entries(shift.sales).reduce(
            (sum, [type, qty]) => {
              const price = placeData?.hookahs?.[type]?.price || 0;
              return sum + price * qty;
            },
            0
          );

          const salaries = shift.coworkers.map((c: any) => {
            const hookahSettings = placeData.hookahs[c.role === "senior" ? "lite" : "lite"];
            const salaryPer = hasSenior
              ? hookahSettings?.salaryWChef ?? 5
              : hookahSettings?.salary ?? 4;
            const salary =
              c.role === "senior"
                ? 0
                : salaryPer * totalSales + (placeData.salaryFix ?? 45);
            return { name: c.name, salary };
          });

          return (
            <li
              key={shift._id}
              className="border border-[#f5c26b]/30 p-4 rounded-xl bg-[#1a1a1a]"
            >
              <h3 className="text-lg font-semibold text-[#f5c26b] mb-2">
                {formatDate(shift.date)}
              </h3>

              <div className="text-sm mb-2">
                <p className="mb-1">Продано кальянов:</p>
                <ul className="ml-4 list-disc">
                  {Object.entries(shift.sales).map(([type, qty]) => {
                    const price = placeData?.hookahs?.[type]?.price || 0;
                    return (
                      <li key={type}>
                        {type}: {qty} шт. × {price}₾ = {qty * price}₾
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="text-sm mb-2">
                <p className="mb-1">Зарплаты:</p>
                <ul className="ml-4 list-disc">
                  {salaries.map((s, i) => (
                    <li key={i}>
                      {s.name}: {s.salary}₾
                    </li>
                  ))}
                  {shift.coalman && (
                    <li>
                      {shift.coalman.name}: {shift.coalman.fixedSalary}₾ (угольщик)
                    </li>
                  )}
                </ul>
              </div>

              <p className="text-sm text-gray-300">
                Общий оборот:{" "}
                <span className="text-[#f5c26b]">{totalRevenue}₾</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
