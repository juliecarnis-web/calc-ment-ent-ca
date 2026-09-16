import React from 'react';

interface FractionSVGProps {
  numerator: number;
  denominator: number;
  showDecimalValue?: boolean;
}

export const FractionSVG: React.FC<FractionSVGProps> = ({
  numerator,
  denominator,
  showDecimalValue = false,
}) => {
  const safeDenom = Math.max(1, denominator);
  const rawNum = Math.max(0, numerator);
  const decimalVal = Math.round((rawNum / safeDenom) * 10000) / 10000;

  // Render 100-grid for centièmes (denominator 100)
  if (safeDenom === 100) {
    const totalCells = 100;
    const filledCells = Math.min(100, rawNum);
    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      const isFilled = i < filledCells;
      cells.push(
        <rect
          key={i}
          x={(i % 10) * 12}
          y={Math.floor(i / 10) * 12}
          width={11}
          height={11}
          rx={1.5}
          fill={isFilled ? '#10b981' : '#f1f5f9'}
          stroke="#0f172a"
          strokeWidth="0.5"
        />
      );
    }

    return (
      <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 backdrop-blur-sm gap-3">
        <div className="flex items-center justify-center gap-6 w-full">
          {/* Grille de 100 centièmes */}
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 120 120" className="w-32 h-32 drop-shadow-md rounded-lg overflow-hidden bg-slate-800 p-1">
              {cells}
            </svg>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Grille de 100 centièmes
            </span>
          </div>

          {/* Fraction notation & description */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center font-black text-2xl text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
              <span>{rawNum}</span>
              <div className="w-10 h-0.5 bg-emerald-400 my-1 rounded-full" />
              <span>{safeDenom}</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 text-center">
              {rawNum} centième{rawNum > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {showDecimalValue && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black text-lg px-4 py-1.5 rounded-xl flex items-center gap-2">
            <span>Valeur décimale =</span>
            <span className="text-xl font-mono text-white bg-emerald-600 px-3 py-0.5 rounded-lg shadow">
              {decimalVal.toString().replace('.', ',')}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render for 1000 millièmes (denominator 1000)
  if (safeDenom === 1000) {
    return (
      <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 backdrop-blur-sm gap-3">
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-col items-center justify-center font-black text-3xl text-white bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 shadow-inner">
            <span>{rawNum}</span>
            <div className="w-16 h-1 bg-emerald-400 my-1 rounded-full" />
            <span>1000</span>
          </div>
          <span className="text-sm font-bold text-emerald-400 bg-emerald-950/80 px-4 py-1.5 rounded-xl border border-emerald-500/40 text-center">
            {rawNum} millième{rawNum > 1 ? 's' : ''}
          </span>
        </div>

        {showDecimalValue && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black text-lg px-4 py-1.5 rounded-xl flex items-center gap-2">
            <span>Valeur décimale =</span>
            <span className="text-xl font-mono text-white bg-emerald-600 px-3 py-0.5 rounded-lg shadow">
              {decimalVal.toString().replace('.', ',')}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Default Pie Chart & Bar for Denominators <= 20 (e.g. 10 dixièmes)
  const pieDenom = Math.min(20, safeDenom);
  const pieNum = Math.min(pieDenom, rawNum);

  const cx = 100;
  const cy = 100;
  const r = 70;

  const slices = [];
  for (let i = 0; i < pieDenom; i++) {
    const startAngle = (i * 2 * Math.PI) / pieDenom - Math.PI / 2;
    const endAngle = ((i + 1) * 2 * Math.PI) / pieDenom - Math.PI / 2;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);

    const largeArcFlag = 2 * Math.PI / pieDenom > Math.PI ? 1 : 0;
    const isFilled = i < pieNum;

    const pathData =
      pieDenom === 1
        ? `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
        : `M ${cx},${cy} L ${x1},${y1} A ${r},${r} 0 ${largeArcFlag},1 ${x2},${y2} Z`;

    slices.push(
      <path
        key={i}
        d={pathData}
        fill={isFilled ? '#10b981' : '#f1f5f9'}
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    );
  }

  // Bar representation
  const barSegments = [];
  const barW = 200;
  const barH = 26;
  const segW = barW / pieDenom;

  for (let i = 0; i < pieDenom; i++) {
    const isFilled = i < pieNum;
    barSegments.push(
      <rect
        key={i}
        x={i * segW}
        y={0}
        width={segW}
        height={barH}
        fill={isFilled ? '#3b82f6' : '#f8fafc'}
        stroke="#1e293b"
        strokeWidth="2"
      />
    );
  }

  return (
    <div className="w-full h-full min-h-[260px] flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-2xl border border-slate-700/60 backdrop-blur-sm gap-3">
      <div className="flex items-center justify-center gap-6 w-full">
        {/* Circle Pie Chart */}
        <div className="flex flex-col items-center gap-1">
          <svg viewBox="0 0 200 200" className="w-32 h-32 drop-shadow-md">
            {slices}
          </svg>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Représentation Disque
          </span>
        </div>

        {/* Fraction Bar & Numbers */}
        <div className="flex flex-col items-center gap-3">
          {/* Fraction notation */}
          <div className="flex flex-col items-center justify-center font-black text-2xl text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
            <span>{rawNum}</span>
            <div className="w-8 h-0.5 bg-emerald-400 my-1 rounded-full" />
            <span>{safeDenom}</span>
          </div>

          {/* Bar SVG */}
          <div className="flex flex-col items-center gap-1">
            <svg viewBox={`0 0 ${barW} ${barH}`} className="w-44 h-7 drop-shadow-sm rounded-lg overflow-hidden border border-slate-700">
              {barSegments}
            </svg>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Bande graduée
            </span>
          </div>
        </div>
      </div>

      {showDecimalValue && (
        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black text-lg px-4 py-1.5 rounded-xl flex items-center gap-2">
          <span>Valeur décimale =</span>
          <span className="text-xl font-mono text-white bg-emerald-600 px-3 py-0.5 rounded-lg shadow">
            {decimalVal.toString().replace('.', ',')}
          </span>
        </div>
      )}
    </div>
  );
};
