export interface InferenceCardData {
  id: number;
  correlationCode: string;
  title: string;
  indicators: {
    label: string;
    value: string;
  }[];
  inferenceTitle: string;
  inferenceText: string;
  textColorClass: string;
  dataSource: string;
  status: string;
}

export function InferenceCard({ card }: { card: InferenceCardData }) {
  return (
    <div className="bg-zinc-950 border-2 border-white/10 p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
      <div>
        <span className="text-[10px] text-brand-neon font-bold tracking-widest uppercase block mb-1">
          {card.correlationCode}
        </span>
        <h3 className="text-lg font-sans font-bold text-white uppercase mb-4">
          {card.title}
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {card.indicators.map((ind, i) => (
            <div key={i} className="border border-white/5 bg-black/40 p-2 flex flex-col">
              <span className="text-[8px] text-white/30 uppercase">{ind.label}</span>
              <span className="text-sm font-bold">{ind.value}</span>
            </div>
          ))}
        </div>
        <div className="bg-black/60 border border-white/5 p-4 font-mono text-[10px] leading-relaxed min-h-[90px]">
          <span className="text-white/30 font-bold block mb-1">{card.inferenceTitle}</span>
          <p className={card.textColorClass}>{card.inferenceText}</p>
        </div>
      </div>
      <div className="border-t border-white/10 pt-4 mt-6 text-[8px] text-white/30 flex justify-between font-mono">
        <span>DATOS: {card.dataSource}</span>
        <span>STATUS: {card.status}</span>
      </div>
    </div>
  );
}
