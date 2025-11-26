"use client";

import { useRouter, useSearchParams } from "next/navigation";

type LocationFilterProps = {
  selected: string;
  locations: string[];
};

export function LocationFilter({ selected, locations }: LocationFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries())); //inget yang ini

    if (value) {
      params.set("location", value);
    } else {
      params.delete("location");
    }

    const query = params.toString();
    router.push(`/browse${query ? `?${query}` : ""}`);
  };

  return (
    <label className="mb-6 flex items-center gap-3 text-gray-700">
      <span className="text-lg font-semibold">Browsing events in</span>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          className=" rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-base font-semibold text-blue-600 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
