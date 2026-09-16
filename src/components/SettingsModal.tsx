import React from 'react';
import { X, Volume2, VolumeX, Clock, Sparkles, RotateCcw } from 'lucide-react';
import { GameSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetAllScores: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetAllScores,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl text-white relative flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black uppercase tracking-wide font-outfit">
              Réglages généraux
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 text-sm">
          {/* Sprint duration */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Durée du mode Sprint</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onUpdateSettings({ sprintDuration: sec })}
                  className={`py-2 rounded-xl font-bold border transition ${
                    settings.sprintDuration === sec
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="font-bold text-white">Effets sonores</p>
                <p className="text-xs text-slate-400">Sons de validation et du chrono</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Scores */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-300">Réinitialiser les séries</p>
              <p className="text-xs text-slate-400">Efface les scores de tous les élèves</p>
            </div>
            <button
              onClick={() => {
                onResetAllScores();
                onClose();
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition shadow"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
