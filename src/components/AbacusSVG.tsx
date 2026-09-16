import React from 'react';

interface AbacusSVGProps {
  num: number;
  limit: number;
}

export const AbacusSVG: React.FC<AbacusSVGProps> = ({ num, limit }) => {
  const safeNum = Math.max(0, num);
  // Check if num has a non-zero decimal part
  const isDecimal = Math.abs(safeNum - Math.round(safeNum)) > 0.0001;

  let rodDigits: { val: number; label: string; isDec: boolean }[] = [];
  let commaAfterRodIndex = -1; // Index of the rod after which the red comma is placed

  if (isDecimal) {
    // Format to max 2 decimal places with comma
    const rounded = Math.round(safeNum * 100) / 100;
    const str = rounded.toString().replace('.', ',');
    const [intStrRaw, decStrRaw] = str.split(',');

    const intStr = intStrRaw || '0';
    const decStr = decStrRaw || '0';

    // Place value labels for integer part (from right to left: U, D, C, M, 10M, 100M)
    const intLabels = ['U', 'D', 'C', 'M', '10M', '100M'];
    const intRodLabels: string[] = [];
    for (let i = 0; i < intStr.length; i++) {
      const posFromRight = intStr.length - 1 - i;
      intRodLabels.push(intLabels[posFromRight] || '');
    }

    // Place value labels for decimal part (d = dixièmes, c = centièmes)
    const decLabels = ['d', 'c'];

    // Assemble integer rods
    for (let i = 0; i < intStr.length; i++) {
      rodDigits.push({
        val: parseInt(intStr[i], 10) || 0,
        label: intRodLabels[i],
        isDec: false,
      });
    }

    // Red comma position is immediately after the last integer rod
    commaAfterRodIndex = intStr.length - 1;

    // Assemble decimal rods
    for (let i = 0; i < decStr.length; i++) {
      rodDigits.push({
        val: parseInt(decStr[i], 10) || 0,
        label: decLabels[i] || '',
        isDec: true,
      });
    }
  } else {
    // Whole Integer
    let rodCount = 2;
    if (limit >= 1000) rodCount = 3;
    if (limit >= 10000) rodCount = 4;
    if (limit >= 100000) rodCount = 5;
    if (limit >= 1000000) rodCount = 6;
    if (limit >= 10000000) rodCount = 7;

    const numInt = Math.round(safeNum);
    let numStr = numInt.toString().padStart(rodCount, '0');
    if (numStr.length > rodCount) rodCount = numStr.length;

    const intLabels = ['U', 'D', 'C', 'M', '10M', '100M', '1M'];
    for (let i = 0; i < rodCount; i++) {
      const val = parseInt(numStr[i], 10) || 0;
      const posFromRight = rodCount - 1 - i;
      rodDigits.push({
        val,
        label: intLabels[posFromRight] || '',
        isDec: false,
      });
    }
  }

  const rodCount = rodDigits.length;
  const r = 16;
  const d = r * 2;
  const rodSpacing = 60;
  const padding = 38;
  const w = (rodCount - 1) * rodSpacing + padding * 2;
  const h = 360;
  const beamY = 110;

  const rods = [];

  for (let i = 0; i < rodCount; i++) {
    const cx = padding + i * rodSpacing;
    const digitInfo = rodDigits[i];
    const val = digitInfo.val;
    const topVal = Math.floor(val / 5);
    const botVal = val % 5;

    const r0Y = 32;
    const r1Y_rest = 72;
    const r1Y_active = beamY - 5 - r - 2;

    const beads = [];

    // Upper deck beads (Red)
    beads.push(
      <g key={`top-0-${i}`}>
        <circle cx={cx} cy={r0Y + 3} r={r} fill="rgba(0,0,0,0.2)" />
        <circle cx={cx} cy={r0Y} r={r} fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <ellipse cx={cx} cy={r0Y - r / 2} rx={r / 2} ry={r / 4} fill="rgba(255,255,255,0.4)" />
      </g>
    );

    const topActiveY = topVal > 0 ? r1Y_active : r1Y_rest;
    beads.push(
      <g key={`top-1-${i}`}>
        <circle cx={cx} cy={topActiveY + 3} r={r} fill="rgba(0,0,0,0.2)" />
        <circle cx={cx} cy={topActiveY} r={r} fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
        <ellipse cx={cx} cy={topActiveY - r / 2} rx={r / 2} ry={r / 4} fill="rgba(255,255,255,0.4)" />
      </g>
    );

    // Lower deck beads (Blue for integer rods, Purple for decimal rods)
    const beadFill = digitInfo.isDec ? '#8b5cf6' : '#3b82f6';
    const beadStroke = digitInfo.isDec ? '#6d28d9' : '#1d4ed8';

    for (let b = 0; b < 5; b++) {
      let cyPos: number;
      if (b < botVal) {
        cyPos = beamY + 5 + r + 2 + b * (d + 2);
      } else {
        cyPos = h - r - 24 - (4 - b) * (d + 2);
      }
      beads.push(
        <g key={`bot-${b}-${i}`}>
          <circle cx={cx} cy={cyPos + 3} r={r} fill="rgba(0,0,0,0.2)" />
          <circle cx={cx} cy={cyPos} r={r} fill={beadFill} stroke={beadStroke} strokeWidth="2" />
          <ellipse cx={cx} cy={cyPos - r / 2} rx={r / 2} ry={r / 4} fill="rgba(255,255,255,0.4)" />
        </g>
      );
    }

    // Place Value Rod Label at the bottom
    const labelBg = digitInfo.isDec ? '#7c3aed' : '#334155';
    const labelText = digitInfo.label;

    rods.push(
      <g key={`rod-${i}`}>
        <line x1={cx} y1={20} x2={cx} y2={h - 22} stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
        {beads}
        {/* Rod Column Badge */}
        {labelText && (
          <g transform={`translate(${cx}, ${h - 10})`}>
            <rect x="-13" y="-10" width="26" height="18" rx="5" fill={labelBg} stroke="#ffffff" strokeWidth="1" />
            <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="sans-serif">
              {labelText}
            </text>
          </g>
        )}
      </g>
    );
  }

  // Red Decimal Comma on the reading beam
  let redCommaElement = null;
  if (isDecimal && commaAfterRodIndex >= 0 && commaAfterRodIndex < rodCount - 1) {
    const cx1 = padding + commaAfterRodIndex * rodSpacing;
    const cx2 = padding + (commaAfterRodIndex + 1) * rodSpacing;
    const commaX = (cx1 + cx2) / 2;

    redCommaElement = (
      <g key="red-comma-indicator">
        {/* Dotted division line separating integer and decimal rods */}
        <line x1={commaX} y1={18} x2={commaX} y2={h - 24} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="4 4" opacity={0.7} />

        {/* Red Comma on the reading beam */}
        <circle cx={commaX} cy={beamY} r={12} fill="#ef4444" opacity={0.3} />
        <circle cx={commaX} cy={beamY} r={8.5} fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
        
        {/* Comma tail */}
        <path
          d={`M ${commaX} ${beamY + 4} Q ${commaX - 3} ${beamY + 13} ${commaX - 5} ${beamY + 15}`}
          stroke="#dc2626"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  }

  return (
    <div className="w-full h-full min-h-[260px] flex items-center justify-center p-2 bg-white rounded-2xl shadow-inner border-2 border-slate-200">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-[300px]"
      >
        {/* Soroban Beam */}
        <rect x={0} y={beamY - 5} width={w} height={10} fill="#334155" rx={2} />
        {rods}
        {redCommaElement}
      </svg>
    </div>
  );
};
