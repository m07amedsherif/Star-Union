import React from "react";

export default function FilterBar ({ filter, setFilter }) {
  const filters = ["all", "active", "completed"];

  return (
    <div className="flex justify-center gap-2 mb-4 flex-wrap">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-full text-sm capitalize transition
            ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-indigo-200"
            }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};