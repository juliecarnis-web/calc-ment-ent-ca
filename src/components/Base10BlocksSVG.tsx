import React from 'react';

interface Base10BlocksSVGProps {
  num: number;
}

export const Base10BlocksSVG: React.FC<Base10BlocksSVGProps> = ({ num }) => {
  if (num > 5000) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 text-center">
        <span className="text-sm md:text-base font-black text-white bg-red-500 px-4 py-3 rounded-xl border-2 border-red-700 shadow-lg flex items-center gap-2">
          <span>⚠️</span> Nombre trop grand pour l'affichage en blocs (&gt; 5 000)
        </span>
      </div>
    );
  }

  const str = Math.max(0, num).toString().padStart(4, '0');
  const th = parseInt(str[str.length - 4], 10) || 0;
  const h = parseInt(str[str.length - 3], 10) || 0;
  const t = parseInt(str[str.length - 2], 10) || 0;
  const u = parseInt(str[str.length - 1], 10) || 0;

  const stack_dx_th = 30;
  const stack_dy_th = 30;
  const stack_dx_h = 8;
  const stack_dy_h = 8;
  const gap_t = 14;
  const gap_u_x = 14;
  const gap_u_y = 14;
  const groupGap = 20;

  let currentX = 0;
  let minY = 0;

  const elements: React.ReactNode[] = [];

  // Thousands
  if (th > 0) {
    for (let i = 0; i < th; i++) {
      const x = currentX + (th - 1 - i) * stack_dx_th;
      const y = -(th - 1 - i) * stack_dy_th;
      minY = Math.min(minY, y - 40);

      // Generating Thousand Paths
      const pathD: string[] = [];
      for (let j = 1; j < 10; j++) {
        const offset = j * 8;
        const dX = j * 4;
        const dY = -j * 4;
        pathD.push(`M${offset},0 v80 M0,${offset} h80`);
        pathD.push(`M${dX},${dY} h80 M${offset},0 l40,-40`);
        pathD.push(`M80,${offset} l40,-40 M${80 + dX},${dY} v80`);
      }

      elements.push(
        <g key={`th-${i}`} transform={`translate(${x}, ${y})`}>
          <polygon points="0,0 40,-40 120,-40 80,0" fill="#fca5a5" stroke="#dc2626" strokeWidth="0.5" strokeLinejoin="round" />
          <polygon points="80,0 120,-40 120,40 80,80" fill="#dc2626" stroke="#991b1b" strokeWidth="0.5" strokeLinejoin="round" />
          <rect x="0" y="0" width="80" height="80" fill="#ef4444" stroke="#dc2626" strokeWidth="0.5" strokeLinejoin="round" />
          <path d={pathD.join(' ')} stroke="#dc2626" strokeWidth="0.5" fill="none" />
        </g>
      );
    }
    const groupW = 120 + (th - 1) * stack_dx_th;
    currentX += groupW + groupGap;
  }

  // Hundreds
  if (h > 0) {
    for (let i = 0; i < h; i++) {
      const x = currentX + (h - 1 - i) * stack_dx_h;
      const y = -(h - 1 - i) * stack_dy_h;
      minY = Math.min(minY, y - 4);

      elements.push(
        <g key={`h-${i}`} transform={`translate(${x}, ${y})`}>
          <polygon points="0,0 4,-4 84,-4 80,0" fill="#86efac" stroke="#16a34a" strokeWidth="0.5" strokeLinejoin="round" />
          <polygon points="80,0 84,-4 84,76 80,80" fill="#16a34a" stroke="#15803d" strokeWidth="0.5" strokeLinejoin="round" />
          <rect x="0" y="0" width="80" height="80" fill="#22c55e" stroke="#16a34a" strokeWidth="0.5" strokeLinejoin="round" />
          <path
            d="M8,0 v80 M8,0 l4,-4 M0,8 h80 M80,8 l4,-4 M16,0 v80 M16,0 l4,-4 M0,16 h80 M80,16 l4,-4 M24,0 v80 M24,0 l4,-4 M0,24 h80 M80,24 l4,-4 M32,0 v80 M32,0 l4,-4 M0,32 h80 M80,32 l4,-4 M40,0 v80 M40,0 l4,-4 M0,40 h80 M80,40 l4,-4 M48,0 v80 M48,0 l4,-4 M0,48 h80 M80,48 l4,-4 M56,0 v80 M56,0 l4,-4 M0,56 h80 M80,56 l4,-4 M64,0 v80 M64,0 l4,-4 M0,64 h80 M80,64 l4,-4 M72,0 v80 M72,0 l4,-4 M0,72 h80 M80,72 l4,-4"
            stroke="#16a34a"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      );
    }
    const groupW = 84 + (h - 1) * stack_dx_h;
    currentX += groupW + groupGap;
  }

  // Tens
  if (t > 0) {
    for (let i = 0; i < t; i++) {
      const x = currentX + i * gap_t;
      minY = Math.min(minY, -4);

      elements.push(
        <g key={`t-${i}`} transform={`translate(${x}, 0)`}>
          <polygon points="0,0 4,-4 12,-4 8,0" fill="#93c5fd" stroke="#2563eb" strokeWidth="0.5" strokeLinejoin="round" />
          <polygon points="8,0 12,-4 12,76 8,80" fill="#2563eb" stroke="#1e40af" strokeWidth="0.5" strokeLinejoin="round" />
          <rect x="0" y="0" width="8" height="80" fill="#3b82f6" stroke="#2563eb" strokeWidth="0.5" strokeLinejoin="round" />
          <path
            d="M0,8 h8 l4,-4 M0,16 h8 l4,-4 M0,24 h8 l4,-4 M0,32 h8 l4,-4 M0,40 h8 l4,-4 M0,48 h8 l4,-4 M0,56 h8 l4,-4 M0,64 h8 l4,-4 M0,72 h8 l4,-4"
            stroke="#2563eb"
            strokeWidth="0.5"
            fill="none"
          />
        </g>
      );
    }
    const groupW = 12 + (t - 1) * gap_t;
    currentX += groupW + groupGap;
  }

  // Units
  if (u > 0) {
    for (let i = 0; i < u; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = currentX + col * gap_u_x;
      const y = 72 - row * gap_u_y;
      minY = Math.min(minY, y - 4);

      elements.push(
        <g key={`u-${i}`} transform={`translate(${x}, ${y})`}>
          <polygon points="0,0 4,-4 12,-4 8,0" fill="#fde047" stroke="#ca8a04" strokeWidth="0.5" strokeLinejoin="round" />
          <polygon points="8,0 12,-4 12,4 8,8" fill="#ca8a04" stroke="#a16207" strokeWidth="0.5" strokeLinejoin="round" />
          <rect x="0" y="0" width="8" height="8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" strokeLinejoin="round" />
        </g>
      );
    }
    const u_cols = Math.min(u, 5);
    const groupW = 12 + (u_cols - 1) * gap_u_x;
    currentX += groupW;
  }

  let maxX = currentX > 0 ? currentX : 12;
  if (th === 0 && h === 0 && t === 0 && u > 0 && currentX > groupGap) {
    maxX = currentX;
  }
  if (u === 0 && currentX > 0) {
    maxX -= groupGap;
  }

  const padding = 8;
  const vbX = -padding;
  const vbY = minY - padding;
  const vbW = maxX + padding * 2;
  const vbH = 80 - minY + padding + 10;

  return (
    <div className="w-full h-full min-h-[240px] flex items-center justify-center p-2 bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <svg
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-[280px]"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
      >
        {elements}
      </svg>
    </div>
  );
};
