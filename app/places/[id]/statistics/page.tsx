"use client";

export default function StatisticsPage({ params }: { params: { id: string } }) {
  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-4 text-[#f5c26b]">
        Статистика заведения #{params.id}
      </h1>
      <p>Здесь будет отображаться статистика.</p>
    </div>
  );
}
