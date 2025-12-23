
import React from 'react';

const Dojo: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full h-full bg-[#8b4513] overflow-hidden flex flex-col items-center justify-center crt-overlay">
      {/* Wooden floor texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 80px)' }}>
      </div>
      
      {/* Dojo Wall */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#fdf5e6] border-b-8 border-[#5d2e0a]">
        {/* Japanese Scroll */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-64 bg-white pixel-border border-8 border-red-900 flex items-center justify-center">
            <div className="text-4xl text-black" style={{ writingMode: 'vertical-rl' }}>空手道</div>
        </div>
        
        {/* Windows */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 pixel-border opacity-50 flex flex-wrap">
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
        </div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 pixel-border opacity-50 flex flex-wrap">
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
            <div className="w-1/2 h-1/2 border border-blue-300"></div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-32">
        {children}
      </div>
    </div>
  );
};

export default Dojo;
