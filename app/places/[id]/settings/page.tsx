"use client";

export default function SettingsPage({ params }: { params: { id: string } }) {
  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-4 text-[#f5c26b]">Настройки заведения #{params.id}</h1>
      <p>Здесь будут настройки.</p>
    </div>
  );
}
