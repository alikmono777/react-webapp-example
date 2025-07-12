'use client'

import FormatCode from "@/components/FormatCode";
import Loader from "@/components/Loader";
import Profile from "@/components/Profile";
import { useEffect, useState } from "react";
import Link from 'next/link'
import { ArrowPathIcon } from "@heroicons/react/24/outline"


type Place = {
  _id: string;
  name: string;
  salaryFix: number;
  uniqueId: string;
  hookahs: Record<string, {
    price: number;
    salary: number;
    salaryWChef: number;
  }>;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
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

  return (

<>
      <div className="w-full mt-6">
        {loadingPlaces ? (
    <div className="flex items-center justify-center p-4">
    <ArrowPathIcon className="w-6 h-6 animate-spin text-[#f5c26b]" />
  </div>
        )
          :
          <div className="flex flex-wrap gap-6 justify-center mt-6">
            {places.map(place =>
<div className="max-w-md w-full bg-[#2b0c0c] text-white rounded-2xl shadow-xl border border-[#5e2d2d] p-6">
  <h2 className="text-xl font-bold mb-3 text-[#f5c26b]">{place.name}</h2>
  <p className="text-sm text-[#e4d4c6] leading-relaxed">
    Продано <span className="font-semibold text-white">124 свечи</span> и <span className="font-semibold text-white">87 салфеток</span> за последний месяц.
    Увеличение продаж на <span className="text-green-400 font-semibold">12%</span>.
  </p>
  <Link href={"/places/" + place.uniqueId} className="card-button mt-6 w-full bg-[#f5c26b] hover:bg-[#e8b146] text-black font-semibold py-2.5 px-4 rounded-xl transition duration-300">
    Перейти в заведение
  </Link>
</div>


            )}
          </div>
        }
      </div>
      </>
  );
}
