"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCoworkerPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("master"); // кальянный мастер по умолчанию
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/coworkers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });

    if (res.ok) {
      router.push("/coworkers");
    } else {
      alert("❌ Ошибка при создании сотрудника");
    }
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
          <label className="block mb-1">Роль</label>
          <select
            className="w-full p-2 rounded bg-[#2a2a2a] border border-gray-600 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="master">Кальянный мастер</option>
            <option value="senior">Старший кальянный мастер</option>
          </select>
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
