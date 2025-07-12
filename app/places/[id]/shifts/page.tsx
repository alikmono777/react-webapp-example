"use client";

import Link from "next/link";

export default function ShiftsPage({ params }: { params: { id: string } }) {
  const shifts = [
    { id: 1, name: "Смена 1" },
    { id: 2, name: "Смена 2" },
  ];

  return (
    <div>
      <Link
        href={`/places/${params.id}/shifts/new`}
        className="block mb-4 bg-[#2b0c0c] border border-[#5e2d2d] text-white font-semibold py-2 px-4 rounded-xl text-center"
      >
        Добавить смену
      </Link>
      <ul className="space-y-2">
        {shifts.map((shift) => (
          <li
            key={shift.id}
            className="bg-[#2b0c0c] border border-[#5e2d2d] p-4 rounded-xl text-white"
          >
            {shift.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
