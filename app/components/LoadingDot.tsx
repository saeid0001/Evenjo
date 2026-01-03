import React from "react";

const LoadingDot = () => {
  return (
    <div className="w-full gap-x-2 flex justify-center items-center">
      <div className="w-2 h-2 bg-shade-300 animate-pulse rounded-full"></div>
      <div className="w-2 h-2 animate-pulse bg-shade-200 rounded-full"></div>
      <div className="w-2 h-2 animate-pulse bg-shade-100 rounded-full"></div>
    </div>
  );
};

export default LoadingDot;
