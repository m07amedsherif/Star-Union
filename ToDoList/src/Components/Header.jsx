import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <FontAwesomeIcon icon={faListCheck} className="text-indigo-600 text-2xl" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
        My To-Do List
      </h1>
    </div>
  );
};

