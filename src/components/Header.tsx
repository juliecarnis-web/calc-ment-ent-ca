import React from 'react';
import { Brain, User, Users, Users2, Shield, Settings } from 'lucide-react';

interface HeaderProps {
  playersCount: number;
  onSetPlayers: (count: number) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  playersCount,
  onSetPlayers,
  onOpenSettings,
}) => {
  return (
    <header className="bg-slate-950 text-white px-4 md:px-8 py-3.5 shadow-xl z-20 shrink-0 border-b-4 border-emerald-500 flex flex-col md:flex-row justify-between items-center gap-4">
      {/* Title & Brand */}
      <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30 flex items-center justify-center shadow-inner">
            <Brain className="w-7 h-7 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white font-outfit">
              Calcul mental <span className="text-emerald-400">- entraînement</span>
            </h1>
            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Classe Adaptative (CP à CM2)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          title="Réglages"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Players selector & Settings */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-center">
        <div className="flex items-center bg-slate-900/90 rounded-full p-1 border border-slate-700/80 shadow-lg font-bold text-xs md:text-sm">
          <button
            onClick={() => onSetPlayers(1)}
            className={`flex items-center gap-1.5 px-3.5 md:px-5 py-2 rounded-full transition-all duration-200 ${
              playersCount === 1
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>INDIVIDUEL</span>
          </button>

          <button
            onClick={() => onSetPlayers(2)}
            className={`flex items-center gap-1.5 px-3.5 md:px-5 py-2 rounded-full transition-all duration-200 ${
              playersCount === 2
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>DUEL</span>
          </button>

          <button
            onClick={() => onSetPlayers(3)}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 md:px-5 py-2 rounded-full transition-all duration-200 ${
              playersCount === 3
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users2 className="w-4 h-4" />
            <span>TRIPLE</span>
          </button>

          <button
            onClick={() => onSetPlayers(4)}
            className={`flex items-center gap-1.5 px-3.5 md:px-5 py-2 rounded-full transition-all duration-200 ${
              playersCount === 4
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>ÉQUIPE</span>
          </button>
        </div>

        <button
          onClick={onOpenSettings}
          className="hidden md:flex items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition shadow"
          title="Réglages généraux"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
