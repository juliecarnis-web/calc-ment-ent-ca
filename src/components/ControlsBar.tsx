import React from 'react';
import { Clock, CheckCheck, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { GameMode } from '../types';

interface ControlsBarProps {
  mode: GameMode;
  onSetMode: (mode: GameMode) => void;
  timeLeft: number;
  sprintDuration: number;
  isGlobalFlipped: boolean;
  onToggleAll: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  mode,
  onSetMode,
  timeLeft,
  sprintDuration,
  isGlobalFlipped,
  onToggleAll,
}) => {
  const isTimeLow = timeLeft <= 10;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-3 flex flex-wrap justify-between items-center gap-4 z-10 shrink-0 shadow-md">
      {/* Mode Selection */}
      <div className="flex items-center space-x-1 font-bold text-xs md:text-sm bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto justify-center">
        <button
          onClick={() => onSetMode('entrainement')}
          className={`px-4 md:px-5 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            mode === 'entrainement'
              ? 'bg-slate-800 text-white shadow-md border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>ENTRAÎNEMENT</span>
        </button>

        <button
          onClick={() => onSetMode('sprint')}
          className={`px-4 md:px-5 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            mode === 'sprint'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>SPRINT {sprintDuration}s</span>
        </button>
      </div>

      {/* Timer & Global Verify Button */}
      <div className="flex items-center gap-4 justify-center w-full md:w-auto">
        {mode === 'sprint' && (
          <div
            className={`font-black text-xl md:text-2xl px-5 py-2 rounded-xl border-2 flex items-center justify-center gap-2.5 shadow-inner transition-colors duration-300 min-w-[130px] ${
              isTimeLow
                ? 'bg-red-950/80 text-red-400 border-red-600 animate-pulse'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/60'
            }`}
          >
            <Clock className={`w-5 h-5 ${isTimeLow ? 'animate-bounce text-red-400' : 'text-amber-400'}`} />
            <span className="font-mono tracking-wider">{timeLeft}s</span>
          </div>
        )}

        <button
          onClick={onToggleAll}
          className={`px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-black shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 text-base md:text-lg tracking-wide flex items-center justify-center gap-2.5 text-white border-b-4 ${
            isGlobalFlipped
              ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-800 active:border-b-0'
              : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 active:border-b-0 text-slate-950 font-extrabold'
          }`}
        >
          {isGlobalFlipped ? (
            <>
              <RotateCcw className="w-5 h-5" />
              <span>NOUVEAU TOUR</span>
            </>
          ) : (
            <>
              <CheckCheck className="w-5 h-5" />
              <span>VÉRIFIER TOUT</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
