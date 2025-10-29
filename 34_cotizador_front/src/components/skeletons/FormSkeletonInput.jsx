import React from "react";

export const FormSkeletonInput = ({ label }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs text-gray-700 mb-2 animate-pulse">
          {label}
        </label>
      )}
      <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  );
};
