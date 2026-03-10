export function AdUnit({ className = "" }: { className?: string }) {
  // In a real app, this would be a Google AdSense <ins> tag with next/script
  // For now, it's a visually distinct placeholder that mimics an ad block.
  return (
    <div className={`bg-neutral-900 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-neutral-500 relative overflow-hidden group ${className}`}>
      <div className="absolute top-2 right-3 text-[10px] tracking-widest uppercase text-neutral-600">Sponsored</div>
      <div className="w-12 h-12 rounded-full border border-neutral-700/50 flex items-center justify-center mb-4 text-neutral-600">
         <span className="text-xl">✨</span>
      </div>
      <h4 className="text-white/80 font-medium mb-2">Elevate Your Space</h4>
      <p className="text-sm text-neutral-400 mb-6 max-w-[200px]">Discover premium furniture collections tailored for your style.</p>
      
      <button className="bg-white/10 hover:bg-white/20 text-white text-xs tracking-widest uppercase px-6 py-2 rounded-full transition-colors">
        Shop Collection
      </button>

      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 pointer-events-none" />
    </div>
  )
}
