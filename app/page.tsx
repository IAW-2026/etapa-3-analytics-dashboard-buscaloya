/**
 * PÁGINA PRINCIPAL: GET / (Landing Page)
 * DESCRIPCIÓN: Pantalla de bienvenida del módulo Analytics.
 * ESTÉTICA: Brutalista / Cyberpunk — Alto Contraste, Cuadrícula Rota, Tipografía Masiva, Velocidad F1.
 */
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

      {/* ── Background Grid: Cuadrícula Industrial ── */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-[0.07] pointer-events-none" 
        suppressHydrationWarning
        style={{ 
          backgroundImage: 'linear-gradient(0deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #ffffff 25%, #ffffff 26%, transparent 27%, transparent 74%, #ffffff 75%, #ffffff 76%, transparent 77%, transparent)', 
          backgroundSize: '50px 50px' 
        }}
      />

      {/* ── Scanline Effect ── */}
      <div 
        className="absolute top-0 left-0 w-full h-[2px] bg-brand-neon/20 pointer-events-none animate-scanline z-50"
      />

      {/* ── Top Bar: Divisor 1px + Info Técnica ── */}
      <header className="relative z-10 border-b border-white/20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-brand-neon font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
              ◆ analytics_module
            </span>
            <span className="text-white/20 font-mono text-[10px]">|</span>
            <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">
              v0.1.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="brutalist-tag">SISTEMA ACTIVO</span>
            <div className="w-2 h-2 bg-brand-neon animate-pulse-neon" />
          </div>
        </div>
      </header>

      {/* ── Main Content: Asimetría Intencional ── */}
      <main className="flex-1 flex flex-col justify-center relative z-10 px-6 md:px-16 lg:px-24 py-16">
        
        <div className="max-w-6xl w-full stagger-children">

          {/* Subtítulo técnico — alineado a la izquierda extrema */}
          <div className="animate-slide-in-left mb-6 flex items-center gap-3">
            <div className="w-12 h-[1px] bg-brand-neon" />
            <span className="text-brand-neon font-mono text-xs tracking-[0.25em] uppercase">
              Módulo de Inferencia y Datos
            </span>
          </div>

          {/* Título masivo — brutalista, puede cortar bordes */}
          <h1 className="animate-slide-in-left text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-sans uppercase tracking-tighter leading-[0.85] mb-0 text-white select-none">
            Analytics
          </h1>
          <h1 className="animate-slide-in-left text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] font-sans uppercase tracking-tighter leading-[0.85] mb-8 text-transparent select-none" style={{ WebkitTextStroke: '2px #00FF00' }}>
            System
          </h1>

          {/* Línea divisora */}
          <div className="animate-slide-in-up w-full h-[1px] bg-white/20 mb-8" />

          {/* Grid de datos telemetría */}
          <div className="animate-slide-in-up grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-white/10 mb-10 border border-white/10">
            {[
              { label: 'FUENTES DE DATOS', value: '04', status: 'neon' },
              { label: 'LATENCIA', value: '12ms', status: 'neon' },
              { label: 'ÚLTIMA SYNC', value: 'AHORA', status: 'safety' },
              { label: 'ESTADO', value: 'ONLINE', status: 'neon' },
            ].map((item, i) => (
              <div key={i} className="bg-black p-4 flex flex-col gap-1">
                <span className="text-white/40 font-mono text-[9px] tracking-[0.2em] uppercase">{item.label}</span>
                <span className={`font-mono text-xl font-bold ${item.status === 'neon' ? 'text-brand-neon' : 'text-brand-safety'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Barra de progreso segmentada */}
          <div className="animate-slide-in-up mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 font-mono text-[9px] tracking-[0.2em] uppercase">Inicialización del sistema</span>
              <span className="text-brand-neon font-mono text-[9px] tracking-wider">100%</span>
            </div>
            <div className="segmented-bar">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="segment active" />
              ))}
            </div>
          </div>

          {/* Descripción */}
          <p className="animate-slide-in-up font-mono text-white/50 text-sm mb-10 max-w-xl leading-relaxed border-l-2 border-brand-neon pl-4">
            SISTEMA DE ANALÍTICAS E INFERENCIA. RECOPILACIÓN Y PROCESAMIENTO DE DATOS DE TODOS LOS MÓDULOS DEL ECOSISTEMA EN TIEMPO REAL.
          </p>

          {/* Botones — Feedback Visual F1 */}
          <div className="animate-slide-in-up flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="bg-brand-neon text-black font-mono font-bold uppercase px-8 py-4 text-sm tracking-wider border-2 border-brand-neon hover:bg-black hover:text-brand-neon transition-all duration-100 text-center">
              ▶ Iniciar Sistema
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer Bar ── */}
      <footer className="relative z-10 border-t border-white/20">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="text-white/30 font-mono text-[9px] tracking-wider uppercase">BuscaloYa © 2026</span>
            <span className="text-white/10 font-mono text-[9px]">|</span>
            <span className="text-white/20 font-mono text-[9px] tracking-wider uppercase">Etapa 2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand-neon font-mono text-[10px] animate-blink">_</span>
            <span className="text-white/30 font-mono text-[9px] tracking-wider uppercase">Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
