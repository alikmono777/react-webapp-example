'use client'

import FormatCode from "@/components/FormatCode";
import Loader from "@/components/Loader";
import Profile from "@/components/Profile";
import { useEffect, useState } from "react";

type Place = {
  _id: string;
  name: string;
  salaryFix: number;
  hookahs: Record<string, {
    price: number;
    salary: number;
    salaryWChef: number;
  }>;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState<"profile" | "code">("profile")
  const [places, setPlaces] = useState<Place[]>([])
  const [loadingPlaces, setLoadingPlaces] = useState(true)

  useEffect(() => {
    setIsMounted(true);
    console.log(window.Telegram?.WebApp)

    // загрузка данных
    fetch('/api/places')
      .then(res => res.json())
      .then(data => {
        setPlaces(data)
        setLoadingPlaces(false)
      })
      .catch(err => {
        console.error("Ошибка загрузки places:", err)
        setLoadingPlaces(false)
      })
  }, []);

  if (!isMounted) return null;

  const renderCode = () => {
    return isMounted ? <FormatCode /> : <Loader />
  }

  const handleViewChange = () => {
    setView(view === "profile" ? "code" : "profile")
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-2 md:p-10 lg:p-24 central-block">
      <img
        src="./img/sombralong.png"
        alt="Sombra Batumi"
        className="w-full max-w-md rounded-xl shadow-lg"
      />
      <div className="mt-4">
        <p>This is a simple webapp that allows you to build a Telegram bot using the Telegram Bot Builder library.</p>
        <p>The library is available on the <a href="https://github.com/tgbotbuilder/react-webapp-example" className="underline text-blue-600">GitHub repository</a>.</p>
      </div>
      <div>
        <button onClick={handleViewChange} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          {view === "code" ? "View Profile ?" : "View Code ?"}
        </button>
      </div>

      {view === "profile" ? (
        <div className="w-full mt-6">
          {loadingPlaces ? (
            <p>Загрузка заведений...</p>
          ) : (
            <ul className="space-y-4">
              {places.map((place) => (
                <li key={place._id} className="p-4 bg-white rounded shadow w-full max-w-md">
                  <h3 className="font-bold text-xl">{place.name}</h3>
                  <p className="text-sm text-gray-600">Фиксированная ставка: {place.salaryFix}₾</p>
                  <ul className="mt-2 text-sm text-gray-800">
                    {Object.entries(place.hookahs).map(([key, h]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {h.price}₾ (ЗП: {h.salary} / с шефом: {h.salaryWChef})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        renderCode()
      )}
    </main>
  );
}
