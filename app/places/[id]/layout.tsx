"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PlaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      router.back();
    });

    return () => {
      tg.BackButton.hide();
      tg.BackButton.offClick(() => {});
    };
  }, [router]);

  return (
    <div className="p-6 w-full">
      <div className="flex gap-2 mb-4">
        <Link
          href={`/places/${id}/settings`}
          className="flex-1 text-center py-2 px-4 rounded-xl bg-[#a83232] text-white"
        >
          Настройки
        </Link>
        <Link
          href={`/places/${id}/statistics`}
          className="flex-1 text-center py-2 px-4 rounded-xl bg-[#a83232] text-white"
        >
          Статистика
        </Link>
        <Link
          href={`/places/${id}/shifts`}
          className="flex-1 text-center py-2 px-4 rounded-xl bg-[#a83232] text-white"
        >
          Смены
        </Link>
      </div>
      {children}
    </div>
  );
}
