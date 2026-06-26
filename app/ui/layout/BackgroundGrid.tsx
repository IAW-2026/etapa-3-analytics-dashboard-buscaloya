export function BackgroundGrid() {
  return (
    <div 
      className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none" 
      suppressHydrationWarning
      style={{ 
        backgroundImage: 'linear-gradient(0deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent)', 
        backgroundSize: '40px 40px' 
      }}
    />
  );
}
