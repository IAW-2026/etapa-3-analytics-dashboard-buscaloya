import Link from 'next/link';
import { DashboardModule } from '@/lib/api';

export interface ModuleCardProps {
  mod: DashboardModule;
}

export function ModuleCard({ mod }: ModuleCardProps) {
  const isNeon = mod.color === 'neon';
  const accentClass = isNeon ? 'text-brand-neon border-brand-neon' : 'text-brand-safety border-brand-safety';
  const bgHover = isNeon ? 'hover:shadow-[8px_8px_0px_rgba(0,255,0,0.15)]' : 'hover:shadow-[8px_8px_0px_rgba(255,77,0,0.15)]';
  
  return (
    <Link 
      href={`/dashboard/detail/${mod.id}`}
      className={`bg-zinc-950 border-2 border-white/10 hover:border-current transition-all duration-150 flex flex-col justify-between min-h-[360px] p-6 shadow-[6px_6px_0px_rgba(255,255,255,0.03)] cursor-pointer block ${accentClass} ${bgHover}`}
    >
      
      {/* Cabecera del Módulo */}
      <div className="border-b border-white/10 pb-4 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-white/40 font-mono tracking-widest">
            {mod.code}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 border ${accentClass}`}>
              {mod.status}
            </span>
            <div className={`w-2 h-2 rounded-full ${isNeon ? 'bg-brand-neon' : 'bg-brand-safety'} animate-pulse`} />
          </div>
        </div>
        <h4 className="text-2xl font-sans text-white uppercase tracking-tighter font-black">
          {mod.name}
        </h4>
      </div>

      {/* Métricas */}
      <div className="flex-1 flex flex-col justify-center gap-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {mod.metrics.map((metric, idx) => (
            <div key={idx} className="border border-white/5 bg-black/40 p-3 flex flex-col gap-1">
              <span className="text-[8px] text-white/30 tracking-wider uppercase font-bold leading-tight">
                {metric.label}
              </span>
              <span className={`text-base font-bold tracking-tighter ${metric.warning ? 'text-brand-safety' : 'text-white'}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal logs de simulación */}
      <div className="bg-black/60 border border-white/5 p-3 my-4 font-mono text-[9px] text-white/50 flex flex-col gap-1">
        <span className="text-white/30 font-bold block mb-1">CONSOLE_OUTPUT //</span>
        {mod.logs.map((log, idx) => (
          <div key={idx} className="truncate">
            <span className={isNeon ? 'text-brand-neon' : 'text-brand-safety'}>&gt;</span> {log}
          </div>
        ))}
      </div>

      {/* Footer del Módulo */}
      <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[8px] text-white/30 tracking-widest font-mono">
        <span>API_LINK:</span>
        <span className="hover:text-white transition-colors duration-75 uppercase truncate max-w-[70%] text-right font-bold">
          {mod.apiEndpoint}
        </span>
      </div>

    </Link>
  );
}
