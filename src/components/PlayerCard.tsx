import React, { useRef, useEffect } from 'react';
import { RotateCcw, Check, Eraser, X, Flame, Sparkles, Layers, Target } from 'lucide-react';
import { CardState, Level, DisplayFormat } from '../types';
import { SKILLS, FIXED_LIMIT_SKILLS } from '../constants';
import { AbacusSVG } from './AbacusSVG';
import { Base10BlocksSVG } from './Base10BlocksSVG';
import { FractionSVG } from './FractionSVG';
import { fmtNum, getOpSym, roundCM2Estimation } from '../utils/mathGenerator';

interface PlayerCardProps {
  card: CardState;
  playersCount: number;
  onUpdateCardSettings: (id: number, updates: Partial<CardState>) => void;
  onUpdateLevel: (id: number, newLevel: Level) => void;
  onRegenerate: (id: number) => void;
  onVerify: (id: number) => void;
  onClear: (id: number) => void;
  onFlipBack: (id: number) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  card,
  playersCount,
  onUpdateCardSettings,
  onUpdateLevel,
  onRegenerate,
  onVerify,
  onClear,
  onFlipBack,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when card is unflipped
  useEffect(() => {
    if (!card.isFlipped) {
      inputRef.current?.focus();
    }
  }, [card.isFlipped, card.id]);

  const isLimitDisabled = FIXED_LIMIT_SKILLS.includes(card.skill);
  const isClassiqueMode = card.format === 'classique' && card.skill !== 'cm2_fractions_dec';

  // Dynamic font sizing based on number of active player cards & magnitude of numbers
  const getEquationFontSize = () => {
    const maxNum = Math.max(card.n1 || 0, card.n2 || 0, card.ans || 0, card.expected || 0);
    const isLarge = maxNum >= 10000;
    const isHuge = maxNum >= 100000;

    if (playersCount === 1) {
      if (isHuge) return 'text-3xl sm:text-4xl md:text-5xl';
      if (isLarge) return 'text-4xl sm:text-5xl md:text-6xl';
      return 'text-5xl sm:text-6xl md:text-7xl';
    }
    if (playersCount === 2) {
      if (isHuge) return 'text-2xl sm:text-3xl md:text-4xl';
      if (isLarge) return 'text-3xl sm:text-4xl md:text-5xl';
      return 'text-4xl sm:text-5xl md:text-6xl';
    }
    if (playersCount === 3) {
      if (isHuge) return 'text-xl sm:text-2xl md:text-3xl';
      if (isLarge) return 'text-2xl sm:text-3xl md:text-4xl';
      return 'text-3xl sm:text-4xl md:text-5xl';
    }
    // 4 players
    if (isHuge) return 'text-lg sm:text-xl md:text-2xl lg:text-3xl';
    if (isLarge) return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
    return 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';
  };

  // Render back correction breakdown
  const renderCorrectionDetails = () => {
    // 1. Fractions
    if (card.skill === 'cm2_fractions_dec') {
      return (
        <div className="flex flex-col items-center gap-2 text-slate-900 font-extrabold py-2">
          <div className="flex items-center gap-3 text-3xl md:text-5xl">
            <span className="bg-emerald-100 text-emerald-950 px-4 py-2 rounded-2xl border-2 border-emerald-300 font-mono">
              {card.n1} / {card.n2}
            </span>
            <span className="text-slate-400">=</span>
            <span className="text-emerald-600 font-black text-4xl md:text-6xl lg:text-7xl font-mono">
              {fmtNum(card.expected)}
            </span>
          </div>
        </div>
      );
    }

    // 2. Multiples
    if (card.skill === 'cm2_multiples_2_3_5_9') {
      const isYes = card.expected === 1;
      return (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center gap-2 text-2xl md:text-4xl font-extrabold">
            <span className="text-slate-900">{fmtNum(card.n1)}</span>
            <span className="text-slate-500">multiple de</span>
            <span className="text-slate-900">{card.n2}</span> ?
          </div>
          <div className={`text-3xl md:text-5xl font-black px-6 py-2 rounded-2xl shadow-sm ${isYes ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-400' : 'bg-red-100 text-red-900 border-2 border-red-400'}`}>
            {isYes ? 'OUI (Tapez 1)' : 'NON (Tapez 0)'}
          </div>
          <span className="text-sm md:text-base text-slate-600 mt-1 font-semibold font-mono bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-200">
            {isYes
              ? `${card.n1} ÷ ${card.n2} = ${card.n1 / card.n2} (Reste 0)`
              : `${card.n1} n'est pas divisible exactement par ${card.n2}`}
          </span>
        </div>
      );
    }

    // 3. Estimation
    if (card.skill === 'cm2_estimation_somme') {
      const r1 = card.roundedN1 ?? roundCM2Estimation(card.n1);
      const r2 = card.roundedN2 ?? roundCM2Estimation(card.n2);
      return (
        <div className="flex flex-col items-center gap-2 font-bold py-2">
          <div className="flex items-center gap-3 text-2xl md:text-4xl text-slate-800">
            <span>{fmtNum(card.n1)}</span>
            <span className="text-slate-400">+</span>
            <span>{fmtNum(card.n2)}</span>
          </div>
          <div className="text-xs md:text-sm text-amber-900 bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-200 text-center font-mono">
            Règles d'arrondi CM2 : {fmtNum(card.n1)} (≈ {fmtNum(r1)}) + {fmtNum(card.n2)} (≈ {fmtNum(r2)})
          </div>
          <div className="text-4xl md:text-6xl lg:text-7xl font-black text-emerald-600 mt-1">
            ≈ {fmtNum(card.expected)}
          </div>
        </div>
      );
    }

    // 4. Doubles / Moitiés
    if (card.skill.includes('doubles_moities')) {
      const typeText = card.subtype === 'double' ? 'Double de' : 'Moitié de';
      return (
        <div className="flex items-center justify-center flex-wrap gap-3 text-slate-900 font-extrabold text-2xl md:text-4xl lg:text-5xl py-2">
          <span className="text-slate-500">{typeText}</span>
          <span className="text-slate-900">{fmtNum(card.n1)}</span>
          <span className="text-slate-500">=</span>
          <span className="text-emerald-600 font-black text-3xl md:text-5xl lg:text-6xl">{fmtNum(card.expected)}</span>
        </div>
      );
    }

    // 5. Multiplier par 5 ou 50
    if (card.skill === 'cm2_mult_5_50_dec') {
      const is50 = card.n2 === 50;
      const multStep = is50 ? card.n1 * 100 : card.n1 * 10;
      return (
        <div className="flex flex-col items-center gap-2 font-bold py-2">
          <div className="text-2xl md:text-4xl text-slate-900">
            {fmtNum(card.n1)} x {card.n2} = <span className="text-emerald-600 font-black text-3xl md:text-5xl lg:text-6xl">{fmtNum(card.expected)}</span>
          </div>
          <div className="text-xs md:text-sm text-slate-700 bg-amber-50 border border-amber-200 px-4 py-1 rounded-xl">
            Méthode : ({fmtNum(card.n1)} x {is50 ? 100 : 10}) ÷ 2 = {fmtNum(multStep)} ÷ 2 = {fmtNum(card.expected)}
          </div>
        </div>
      );
    }

    const symStr = <span className="text-slate-500 px-1 font-black">{getOpSym(card.op)}</span>;
    const eqStr = <span className="text-slate-500 px-1 font-black">=</span>;

    let n1Str: React.ReactNode;
    let n2Str: React.ReactNode;
    let ansStr: React.ReactNode;

    if (card.format === 'boulier' || card.format === 'blocs') {
      n1Str = <span className="text-slate-900">{fmtNum(card.n1)}</span>;
      if (card.skill.includes('comp_')) {
        n2Str = <span className="text-emerald-600 font-black">{fmtNum(card.n2)}</span>;
        ansStr = <span className="text-slate-500">{fmtNum(card.ans)}</span>;
      } else {
        n2Str = <span className="text-slate-500">{fmtNum(card.n2)}</span>;
        ansStr = <span className="text-emerald-600 font-black">{fmtNum(card.ans)}</span>;
      }
    } else if (card.skill.includes('comp_')) {
      n1Str = <span className="text-slate-500">{fmtNum(card.n1)}</span>;
      n2Str = <span className="text-emerald-600 font-black">{fmtNum(card.n2)}</span>;
      ansStr = <span className="text-slate-500">{fmtNum(card.ans)}</span>;
    } else {
      n1Str = <span className="text-slate-500">{fmtNum(card.n1)}</span>;
      n2Str = <span className="text-slate-500">{fmtNum(card.n2)}</span>;
      ansStr = <span className="text-emerald-600 font-black">{fmtNum(card.ans)}</span>;
    }

    if (card.skill.includes('mult_decomp')) {
      const t1 = Math.floor(card.n1 / 10) * 10;
      const u1 = card.n1 % 10;
      return (
        <div className="flex flex-col items-center justify-center gap-2 w-full font-bold py-1">
          <div className="flex items-center justify-center text-2xl md:text-4xl">
            {n1Str} {symStr} {n2Str}
          </div>
          <div className="flex items-center justify-center text-sm md:text-lg text-slate-700 bg-slate-100 px-4 py-1 rounded-xl border border-slate-200">
            <span>({t1} {symStr} {n2Str})</span>
            <span className="mx-2 font-black text-slate-400">+</span>
            <span>({u1} {symStr} {n2Str})</span>
          </div>
          <div className="flex items-center justify-center text-3xl md:text-5xl font-black text-emerald-600 mt-1">
            {eqStr} {ansStr}
          </div>
        </div>
      );
    }

    // Standard Equation Display (Huge font in classique mode for classroom visibility)
    if (isClassiqueMode) {
      return (
        <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4 font-black whitespace-nowrap text-3xl md:text-5xl lg:text-6xl">
          {n1Str} {symStr} {n2Str} {eqStr} <span className="text-emerald-600 font-black text-4xl md:text-6xl lg:text-7xl ml-2">{fmtNum(card.ans)}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center flex-wrap gap-1.5 md:gap-3 font-black whitespace-nowrap text-2xl md:text-4xl lg:text-5xl">
        {n1Str} {symStr} {n2Str} {eqStr} <span className="text-emerald-600 font-black text-3xl md:text-5xl lg:text-6xl ml-1">{fmtNum(card.ans)}</span>
      </div>
    );
  };

  return (
    <div
      className={`perspective-1000 relative w-full flex-1 flex flex-col min-h-[680px] md:min-h-[720px] h-full ${
        card.isFlipped ? 'flipped' : ''
      }`}
    >
      <div className="flipper w-full h-full relative transform-style-3d">
        {/* ================= FACE AVANT (FRONT) ================= */}
        <div className="front absolute inset-0 w-full h-full bg-white rounded-3xl shadow-xl p-3.5 md:p-4 border-4 border-slate-300 overflow-hidden flex flex-col">
          
          {/* Card Controls Panel (Niveau, Compétence, Format, Champ Numérique) */}
          <div className="bg-slate-100 rounded-2xl mb-3 p-2.5 border-2 border-slate-200 shadow-sm flex flex-col gap-2 shrink-0">
            
            {/* Row 1: Level Select + Skill Select */}
            <div className="flex items-center gap-2 w-full">
              {/* 1. Choix du Niveau */}
              <div className="flex items-center gap-1 bg-slate-900 text-white rounded-xl px-2 py-1 shadow shrink-0 border border-slate-700">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest hidden sm:inline">Niveau:</span>
                <select
                  value={card.level}
                  onChange={(e) => onUpdateLevel(card.id, e.target.value as Level)}
                  className="bg-transparent text-white font-black outline-none text-xs md:text-sm cursor-pointer py-0.5"
                  title="Choix du niveau"
                >
                  <option value="CP" className="bg-slate-900 text-white">CP</option>
                  <option value="CE1" className="bg-slate-900 text-white">CE1</option>
                  <option value="CE2" className="bg-slate-900 text-white">CE2</option>
                  <option value="CM1" className="bg-slate-900 text-white">CM1</option>
                  <option value="CM2" className="bg-slate-900 text-white">CM2</option>
                </select>
              </div>

              {/* 2. Choix de la Compétence */}
              <div className="flex-1 min-w-0">
                <select
                  value={card.skill}
                  onChange={(e) => onUpdateCardSettings(card.id, { skill: e.target.value })}
                  className="w-full bg-white border-2 border-indigo-200 text-indigo-950 font-bold rounded-xl h-9 px-2 text-xs outline-none cursor-pointer truncate shadow-sm hover:border-indigo-400 transition"
                  title="Choix de la compétence"
                >
                  {SKILLS[card.level].map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Format Select + Limit/Champ Numérique + Regenerate Button */}
            <div className="flex items-center justify-between gap-2 w-full">
              {/* 3. Choix du Format Visuel */}
              <div className="flex items-center gap-1 bg-amber-100 border-2 border-amber-300 rounded-xl px-2 h-9 shadow-sm shrink-0">
                <Layers className="w-3.5 h-3.5 text-amber-700 hidden sm:inline" />
                <select
                  value={card.format}
                  onChange={(e) =>
                    onUpdateCardSettings(card.id, { format: e.target.value as DisplayFormat })
                  }
                  className="bg-transparent text-amber-950 font-black outline-none text-xs cursor-pointer"
                  title="Choix du format d'affichage"
                >
                  <option value="classique">Classique</option>
                  <option value="boulier">Boulier</option>
                  <option value="blocs">Blocs</option>
                </select>
              </div>

              {/* 4. Choix du Champ Numérique / Limite */}
              <div
                className={`flex-1 flex items-center gap-1 bg-white border-2 rounded-xl px-2 h-9 shadow-sm transition ${
                  isLimitDisabled
                    ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-slate-500 hidden sm:inline shrink-0" />
                <select
                  value={card.limit}
                  disabled={isLimitDisabled}
                  onChange={(e) =>
                    onUpdateCardSettings(card.id, { limit: parseInt(e.target.value, 10) })
                  }
                  className="w-full bg-transparent font-bold text-slate-800 outline-none text-xs cursor-pointer truncate"
                  title="Choix du champ numérique (limite)"
                >
                  <option value="10">&lt; 10</option>
                  <option value="100">&lt; 100</option>
                  <option value="1000">&lt; 1 000</option>
                  <option value="10000">&lt; 10 000</option>
                  <option value="100000">&lt; 100 000</option>
                  <option value="1000000">&lt; 1 000 000</option>
                </select>
              </div>

              {/* Bouton Nouveau Calcul / Regenerate */}
              <button
                onClick={() => onRegenerate(card.id)}
                className="bg-slate-200 text-slate-800 h-9 w-9 rounded-xl font-black shadow hover:bg-slate-300 transition flex items-center justify-center shrink-0 border border-slate-300 active:scale-95"
                title="Générer un nouveau calcul"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Player Name & Streak Banner */}
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              {card.playerName}
            </span>
            {card.streak > 0 && (
              <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-sm animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Série: {card.streak}
              </span>
            )}
          </div>

          {/* Main Equation Box (ALWAYS on 1 line with whitespace-nowrap and dynamic font size) */}
          <div className="bg-slate-900 rounded-2xl text-white mb-2 shadow-inner py-3.5 px-3 flex items-center justify-center shrink-0 border-b-4 border-slate-800 min-h-[85px] relative overflow-hidden">
            <div
              dangerouslySetInnerHTML={{ __html: card.display }}
              className={`font-black tracking-wide text-center w-full flex items-center justify-center font-outfit whitespace-nowrap overflow-hidden text-ellipsis ${card.skill === 'cm2_fractions_dec' ? '' : getEquationFontSize()}`}
            />
          </div>

          {/* Visual Workspace Canvas */}
          <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden my-1">
            {card.skill === 'cm2_fractions_dec' ? (
              <FractionSVG numerator={card.n1} denominator={card.n2} />
            ) : card.format === 'boulier' ? (
              <AbacusSVG num={card.n1} limit={card.limit} />
            ) : card.format === 'blocs' ? (
              <Base10BlocksSVG num={card.n1} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-center">
                <Sparkles className="w-8 h-8 mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-500">Mode Calcul Mental Direct</p>
                <p className="text-xs text-slate-400 mt-0.5">Entrez votre résultat ci-dessous</p>
              </div>
            )}
          </div>

          {/* User Answer Input (Supports decimal commas and step="any") */}
          <div className="shrink-0 flex flex-col items-center mt-2 bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={card.userAnswer}
              onChange={(e) =>
                onUpdateCardSettings(card.id, { userAnswer: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onVerify(card.id);
                }
              }}
              placeholder="Réponse..."
              className="w-full md:w-4/5 h-16 md:h-20 text-center text-4xl md:text-5xl font-black text-slate-900 bg-white border-4 border-slate-300 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none shadow-inner transition-all font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3 shrink-0 w-full">
            <button
              onClick={() => onVerify(card.id)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-lg md:text-xl font-black py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 border-b-4 border-slate-950 active:border-b-0"
            >
              <Check className="w-6 h-6 text-emerald-400" />
              <span>VÉRIFIER</span>
            </button>
            <button
              onClick={() => onClear(card.id)}
              className="w-16 md:w-20 bg-white border-2 border-slate-300 text-red-500 hover:bg-red-50 text-xl font-black py-3 rounded-xl shadow transition flex items-center justify-center active:scale-95"
              title="Effacer"
            >
              <Eraser className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ================= FACE ARRIÈRE (BACK / CORRECTION) ================= */}
        <div className="back absolute inset-0 w-full h-full bg-slate-50 rounded-3xl shadow-2xl flex flex-col p-3.5 md:p-5 border-4 border-slate-300 overflow-hidden">
          {/* Correction Header */}
          <div className="flex justify-between items-center mb-2 shrink-0 px-2 border-b-2 border-slate-200 pb-2">
            <h3 className="font-black text-xl md:text-2xl text-slate-800 uppercase tracking-widest font-outfit">
              Correction
            </h3>
            <div
              className={`px-5 py-2 rounded-xl font-black text-xs md:text-sm shadow tracking-widest flex items-center gap-2 border-b-4 ${
                card.isCorrect
                  ? 'bg-emerald-500 text-slate-950 border-emerald-700 font-extrabold'
                  : 'bg-red-500 text-white border-red-700'
              }`}
            >
              {card.isCorrect ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>BRAVO !</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 stroke-[3]" />
                  <span>ERREUR</span>
                </>
              )}
            </div>
          </div>

          {/* If Classique mode: Correction fills the whole card center with giant text for classroom visibility */}
          {isClassiqueMode ? (
            <div className="flex-1 w-full my-auto flex flex-col items-center justify-center p-3 md:p-4">
              <div className="w-full text-center flex flex-col justify-center items-center gap-y-4 bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-emerald-200 my-auto">
                {renderCorrectionDetails()}
              </div>
            </div>
          ) : (
            /* Boulier, Blocs or Fraction mode: Balanced layout with correction top + visual canvas bottom */
            <>
              <div className="shrink-0 flex items-center justify-center my-2 w-full z-20 relative">
                <div className="w-full text-center flex flex-col justify-center items-center gap-y-2 bg-white p-4 md:p-5 rounded-2xl shadow-md border-2 border-slate-200 font-bold">
                  {renderCorrectionDetails()}
                </div>
              </div>

              <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden pb-2 z-10 my-1 min-h-[160px]">
                {card.skill === 'cm2_fractions_dec' ? (
                  <FractionSVG numerator={card.n1} denominator={card.n2} showDecimalValue={true} />
                ) : card.format === 'boulier' ? (
                  <AbacusSVG num={card.expected} limit={Math.max(card.limit, card.expected)} />
                ) : (
                  <Base10BlocksSVG num={card.expected} />
                )}
              </div>
            </>
          )}

          {/* Question Suivante button */}
          <div className="mt-auto shrink-0 pt-2">
            <button
              onClick={() => onFlipBack(card.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5"
            >
              <RotateCcw className="w-5 h-5" />
              <span>QUESTION SUIVANTE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
