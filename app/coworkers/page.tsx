"use client";

import Link from "next/link";

type StaffMember = {
  id: string;
  name: string;
  role: string;
};

export default function StaffListPage() {
  const staff: StaffMember[] = [
    { id: "1", name: "Алексей", role: "Кальянщик" },
    { id: "2", name: "Мария", role: "Менеджер" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#f5c26b] mb-4">Сотрудники</h1>

      <Link
        href="/coworkers/new"
        className="inline-block mb-6 border border-[#f5c26b] text-[#f5c26b] hover:bg-[#f5c26b]/10 font-semibold px-4 py-2 rounded-xl transition"
      >
        ➕ Добавить сотрудника
      </Link>

      <ul className="space-y-3 text-white">
        {staff.map((person) => (
          <li
            key={person.id}
            className="p-4 border border-[#f5c26b]/30 rounded-xl bg-[#1a1a1a]"
          >
            <div className="font-semibold text-lg">{person.name}</div>
            <div className="text-sm text-gray-400">{person.role}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
