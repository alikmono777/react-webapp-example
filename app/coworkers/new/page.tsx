"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStaffPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // здесь можно отправить POST-запрос в /api/staff
    console.log("Создан сотрудник:", { name, role });

    router.push("/staff"); // возврат к списку
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-bold mb-4 text-[#f5c26b]">
        Добавление сотрудника
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Имя</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Должность</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-semibold px-4 py-2 rounded-xl transition"
        >
          ✅ Сохранить
        </button>
      </form>
    </div>
  );
}
