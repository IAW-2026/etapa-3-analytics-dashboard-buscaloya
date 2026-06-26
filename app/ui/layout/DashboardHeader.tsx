import Link from 'next/link';

export interface DashboardHeaderProps {
  title?: string;
  tagLabel?: string;
  showInferenceLink?: boolean;
  backLink?: string;
  backText?: string;
}

export function DashboardHeader({
  title = "Dashboard_Central",
  tagLabel = "CONTROL // MONITOR",
  showInferenceLink = true,
  backLink = "/",
  backText = "<// RETORNAR"
}: DashboardHeaderProps) {
  return (
    <header className="relative z-10 border-b-2 border-white/20 bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-brand-neon text-lg font-bold tracking-[0.2em] uppercase">
            ◆ ANALYTICS
          </span>
          <span className="text-white/20">/</span>
          <span className="text-white font-sans text-xl uppercase tracking-tighter">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-6 justify-between sm:justify-end">
          <div className="flex items-center gap-3">
            <span className="brutalist-tag animate-pulse-neon">{tagLabel}</span>
            <div className="w-2.5 h-2.5 bg-brand-neon animate-pulse-neon" />
          </div>
          <div className="flex items-center gap-3">
            {showInferenceLink && (
              <Link href="/dashboard/inference" className="border-2 border-brand-neon text-brand-neon hover:bg-brand-neon hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-all duration-100">
                ⚡ Cruzar Datos
              </Link>
            )}
            <Link href={backLink} className="border-2 border-white text-white hover:bg-white hover:text-black font-mono font-bold uppercase px-4 py-2 text-xs tracking-wider transition-colors duration-100">
              {backText}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
