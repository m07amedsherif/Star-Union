import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

export default function EmptyState() {
  return (
    <div className="text-center mt-8 text-gray-400 dark:text-gray-500">
      <FontAwesomeIcon icon={faClipboardList} className="text-4xl mb-3" />
      <p className="text-sm md:text-base">No tasks yet. Add something productive 🚀</p>
    </div>
  );
};

