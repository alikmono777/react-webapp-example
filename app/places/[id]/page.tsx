import { use } from "react";

interface Props {
  params: { id: string };
}

export default function PlacePage({ params }: Props) {
  const { id } = params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Место #{id}</h1>
      <p>Здесь будет информация о месте с ID: {id}</p>
    </div>
  );
}