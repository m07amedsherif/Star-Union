import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <div
      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-3 shadow-sm hover:shadow-md transition"
    >
      <div
        onClick={() => onToggle(todo.id)}
        className="flex items-center gap-3 cursor-pointer flex-1"
      >
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${
            todo.completed
              ? "bg-green-500 border-green-500"
              : "border-gray-400"
          }`}
        >
          {todo.completed && (
            <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
          )}
        </div>

        <p
          className={`text-sm md:text-base break-words
          ${
            todo.completed
              ? "line-through text-gray-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {todo.text}
        </p>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 transition ml-3"
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};
