"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline"


type HookahInfo = {
  price: number;
  salaryWChef: number;
  salary: number;
};

type PlaceData = {
  _id: string;
  name: string;
  salaryFix: number;
  hookahs: Record<string, HookahInfo>;
};

export default function SettingsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/places/${params.id}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleChange = (type: keyof HookahInfo, key: string, value: string) => {
    if (!data) return;
    const updated = { ...data };
    if (!updated.hookahs[key]) return;
    const numeric = parseFloat(value);
    if (!isNaN(numeric)) {
      updated.hookahs[key][type] = numeric;
    } else if (value === "") {
      updated.hookahs[key][type] = 0;
    }
    setData(updated);
  };

  const handleSalaryFixChange = (value: string) => {
    if (!data) return;
    const updated = { ...data };
    const numeric = parseFloat(value);
    updated.salaryFix = isNaN(numeric) ? 0 : numeric;
    setData(updated);
  };

  const handleSave = async () => {
    const res = await fetch(`/api/places/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("✅ Сохранено");
    } else {
      alert("❌ Ошибка при сохранении");
    }
  };

  if (loading || !data) return <div className="flex items-center justify-center p-4"><ArrowPathIcon className="w-6 h-6 animate-spin text-[#f5c26b]" /></div>;

  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-4 text-[#f5c26b]">
        Настройки заведения: {data.name}
      </h1>

      <div className="mb-6 max-w-sm">
        <label className="block mb-1 text-sm text-[#f5c26b]">Фиксированная зарплата</label>
        <div className="relative">
          <input
            type="text"
            value={data.salaryFix.toString()}
            onChange={(e) => handleSalaryFixChange(e.target.value)}
            className="w-full p-2 pr-10 rounded bg-[#2a2a2a] border border-gray-600 text-white"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f5c26b]">₾</span>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-[#f5c26b] mb-2">Кальяны:</h2>
      <div className="space-y-6">
      {Object.entries(data.hookahs).map(([key, hookah]) => (
  <div
    key={key}
    className="border p-4 rounded-xl border-[#f5c26b]/40 bg-[#1b1b1b]"
  >
    <h3 className="font-bold text-[#f5c26b] mb-2 capitalize">{key}</h3>
    <div className="grid grid-cols-3 gap-4">
      {/* Цена */}
      <div className="relative">
        <label className="block text-xs mb-1 text-[#f5c26b]">Цена</label>
        <input
          type="text"
          value={hookah.price.toString()}
          onChange={(e) => handleChange("price", key, e.target.value)}
          className="w-full p-2 pr-8 rounded bg-[#2a2a2a] border border-gray-600 text-white"
        />
        <span className="absolute right-2 bottom-[10px] text-[#f5c26b]">₾</span>
      </div>

      {/* Зарплата */}
      <div className="relative">
        <label className="block text-xs mb-1 text-[#f5c26b]">Зарплата</label>
        <input
          type="text"
          value={hookah.salary.toString()}
          onChange={(e) => handleChange("salary", key, e.target.value)}
          className="w-full p-2 pr-8 rounded bg-[#2a2a2a] border border-gray-600 text-white"
        />
        <span className="absolute right-2 bottom-[10px] text-[#f5c26b]">₾</span>
      </div>

      {/* Зарплата с шефом */}
      <div className="relative">
        <label className="block text-xs mb-1 text-[#f5c26b]">С шефом</label>
        <input
          type="text"
          value={hookah.salaryWChef.toString()}
          onChange={(e) => handleChange("salaryWChef", key, e.target.value)}
          className="w-full p-2 pr-8 rounded bg-[#2a2a2a] border border-gray-600 text-white"
        />
        <span className="absolute right-2 bottom-[10px] text-[#f5c26b]">₾</span>
      </div>
    </div>
  </div>
))}

      </div>

      <button
        onClick={handleSave}
        className="mt-8 border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-semibold px-6 py-2 rounded-xl transition"
      >
        💾 Сохранить изменения
      </button>
    </div>
  );
}
