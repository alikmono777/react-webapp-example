"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewShiftPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const [coworkers, setCoworkers] = useState<any[]>([]);
  const [placeData, setPlaceData] = useState<any>(null);

  const [selectedCoworkers, setSelectedCoworkers] = useState<string[]>([]);
  const [sales, setSales] = useState<Record<string, number>>({});
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState<string | null>(null);

  const [hasCoalman, setHasCoalman] = useState(false);
  const [coalmanId, setCoalmanId] = useState<string>("");

  // Загружаем сотрудников
  useEffect(() => {
    fetch("/api/coworkers")
      .then((res) => res.json())
      .then(setCoworkers)
      .catch(() => setError("Не удалось загрузить сотрудников"));
  }, []);

  // Загружаем настройки заведения
  useEffect(() => {
    fetch(`/api/places/${params.id}`)
      .then((res) => res.json())
      .then(setPlaceData)
      .catch(() => setError("Не удалось загрузить настройки заведения"));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const allSelected = [...selectedCoworkers, hasCoalman ? coalmanId : null].filter(Boolean);
    const uniqueSet = new Set(allSelected);
    if (uniqueSet.size !== allSelected.length) {
      setError("Один и тот же сотрудник не может быть назначен дважды");
      return;
    }

    const selected = coworkers.filter((c) => selectedCoworkers.includes(c._id));

    const body = {
      placeId: params.id,
      date,
      coworkers: selected.map((c) => ({
        coworkerId: c._id,
        role: c.role,
      })),
      sales,
      coalman: hasCoalman ? { coworkerId: coalmanId, fixedSalary: 70 } : null,
    };

    const res = await fetch("/api/shifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push(`/places/${params.id}/shifts`);
    } else {
      const err = await res.json();
      setError(err.error || "Ошибка при создании смены");
    }
  };

  const toggleCoworker = (id: string) => {
    setSelectedCoworkers((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const handleSaleChange = (key: string, value: string) => {
    const num = parseInt(value);
    setSales((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  if (!placeData) {
    return <p className="text-white p-6">Загрузка настроек заведения...</p>;
  }

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[#f5c26b]">
        Добавить смену для заведения #{params.id}
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1">Дата смены</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
          />
        </div>

        <div>
          <label className="block mb-2">Сотрудники (до 2)</label>
          <div className="space-y-2">
            {coworkers.map((c) => (
              <label key={c._id} className="block">
                <input
                  type="checkbox"
                  checked={selectedCoworkers.includes(c._id)}
                  onChange={() => toggleCoworker(c._id)}
                  className="mr-2"
                />
                {c.name} ({c.role === "senior" ? "Старший" : "Мастер"})
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2">Угольщик</label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={hasCoalman}
              onChange={(e) => setHasCoalman(e.target.checked)}
              className="mr-2"
            />
            Добавить угольщика (фикс. зп 70₾)
          </label>

          {hasCoalman && (
            <select
              value={coalmanId}
              onChange={(e) => setCoalmanId(e.target.value)}
              className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
            >
              <option value="">-- Выберите угольщика --</option>
              {coworkers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block mb-2">Продажи кальянов</label>
          {Object.entries(placeData.hookahs).map(([key, config]) => (
            <div key={key} className="mb-2">
              <label className="block text-sm mb-1 text-[#f5c26b] capitalize">
                {key} — {config.price}₾
              </label>
              <input
                type="number"
                min={0}
                value={sales[key] || ""}
                onChange={(e) => handleSaleChange(key, e.target.value)}
                className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-semibold px-6 py-2 rounded-xl transition"
        >
          💾 Сохранить смену
        </button>
      </form>
    </div>
  );
}
