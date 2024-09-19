"use client";
import { useStore } from "src/store";

export default function Dashboard() {
  const { user } = useStore();
  if (!user) return null;

  return (
    <div className="min-h-[50vh]">
      <h1 className="text-3xl font-bold underline text-center">
        Hello World!!!
      </h1>
    </div>
  );
}
