"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  params: { id: string };
}

export default function PlacePage({ params }: Props) {
  const { id } = params;
  const router = useRouter(); // ✅ Вставляем сюда

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      router.back(); // работает, потому что router уже объявлен
    });

    return () => {
      tg.BackButton.hide();
      tg.BackButton.offClick(() => {}); // можно заменить на tg.BackButton.offClick()
    };
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Место #{id}</h1>
      <p>Здесь будет информация о месте с ID: {id}</p>
    </div>
  );
}
