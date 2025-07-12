"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlaceIndexPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/places`);
  }, [params.id, router]);

  return null;
}
