import Link from 'next/link';

export interface DetailHeaderProps {
  moduleId: string;
  title: string;
  themeColor: string;
  isOnline: boolean;
}

export function DetailHeader({ moduleId, title, themeColor, isOnline }: DetailHeaderProps) {
  return (
    <header className="relative z-10 border-b-2 border-white/20 bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-4">
          <span className={`font-bold tracking-[0.2em] uppercase ${themeColor}`}>
            ◆ {moduleId.toUpperCase()} {"// DETAIL"}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-white font-sans text-xl uppercase tracking-tighter">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-6 justify-between sm:justify-end">
          <div className="flex items-center gap-3">
            <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 border ${themeColor}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE (FALLBACK)'}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-brand-neon' : 'bg-brand-safety'} animate-pulse`} />
          </div>
          <Link href="/dashboard" className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100">
            {"<// VOLVER AL PANEL"}
          </Link>
        </div>
      </div>
    </header>
  );
}
