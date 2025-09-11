import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1f241f] z-50">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-[#647a67] border-[#3c433b] animate-spin"></div>
        {/* Inner Circle Glow */}
        <div className="absolute inset-3 rounded-full bg-[#3c433b] animate-pulse"></div>
      </div>
      <p className="ml-4 text-[#647a67] text-lg font-semibold animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
