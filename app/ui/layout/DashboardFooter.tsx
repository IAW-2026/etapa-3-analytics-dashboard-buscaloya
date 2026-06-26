export interface DashboardFooterProps {
  label?: string;
  status?: string;
}

export function DashboardFooter({ 
  label = "Panel Consolidado", 
  status = "STABLE_RUN" 
}: DashboardFooterProps) {
  return (
    <footer className="relative z-10 border-t border-white/20 bg-black/90 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-white/30">
      <div>
        {`BuscaloYa Ecosistema Centralizado © 2026 // ${label}`}
      </div>
      <div className="flex gap-4">
        <span>SECURE_LINK: OK</span>
        <span>|</span>
        <span className="text-brand-neon">STATUS: {status}</span>
      </div>
    </footer>
  );
}
