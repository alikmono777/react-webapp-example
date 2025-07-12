import { useEffect } from "react";
import { useRouter } from "next/navigation";

"use client";

export default function NewShiftPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      router.back(); // или router.push(`/places/${params.id}`)
    });

    return () => {
      tg.BackButton.hide();
      tg.BackButton.offClick(() => {});
    };
  }, [router, params.id]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 text-[#f5c26b]">
        Добавить смену для заведения #{params.id}
      </h1>
      <p className="text-white">Здесь будет форма добавления смены.</p>
    </div>
  );
}
