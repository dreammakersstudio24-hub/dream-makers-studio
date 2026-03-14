"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

interface CompareSliderProps {
  originalImage: string;
  resultImage: string;
}

export function CompareSlider({ originalImage, resultImage }: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      handleMove(e.touches[0].clientX);
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[4/3] max-h-[70vh] bg-neutral-900 rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl cursor-ew-resize select-none touch-none"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* Result Image (Bottom Layer - Revealed as slider moves right) */}
      <img 
        src={resultImage} 
        alt="After Redesign" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
      />

      {/* Label for Result */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest text-white border border-white/10 pointer-events-none">
        Redesign
      </div>

      {/* Original Image (Top Layer - Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <img 
          src={originalImage} 
          alt="Original" 
          className="absolute inset-0 w-full h-full object-contain max-w-none" 
          style={{ width: containerRef.current?.offsetWidth || '100vw' }}
        />
        {/* Label for Original (Moves with clip) */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest text-white border border-white/10">
            Original
        </div>
      </div>

      {/* Slider Line and Handle */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black border border-neutral-200">
          <MoveHorizontal className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
