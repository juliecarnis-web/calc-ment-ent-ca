import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { PlayerCard } from './components/PlayerCard';
import { SettingsModal } from './components/SettingsModal';
import { CardState, Level, GameMode, GameSettings } from './types';
import { SKILLS, LIMITS_PER_LEVEL } from './constants';
import { generateProblem } from './utils/mathGenerator';
import { playSuccessSound, playErrorSound, playTickSound, playFanfareSound } from './utils/audio';

const PLAYER_DEFAULT_NAMES = [
  'Élève 1',
  'Élève 2',
  'Élève 3',
  'Élève 4',
];

function checkIsCorrect(userAnswer: string, expected: number): boolean {
  if (!userAnswer) return false;
  const cleaned = userAnswer.trim().replace(',', '.');
  const userVal = parseFloat(cleaned);
  if (isNaN(userVal)) return false;
  return Math.abs(userVal - expected) < 0.0001;
}

export default function App() {
  const [playersCount, setPlayersCount] = useState<number>(1);
  const [mode, setMode] = useState<GameMode>('entrainement');
  const [isGlobalFlipped, setIsGlobalFlipped] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const [settings, setSettings] = useState<GameSettings>({
    sprintDuration: 30,
    soundEnabled: true,
    showHints: true,
  });

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to construct initial card state
  const createInitialCardState = useCallback((id: number, existingCard?: CardState): CardState => {
    const level: Level = existingCard ? existingCard.level : 'CE2';
    const limit = existingCard ? existingCard.limit : LIMITS_PER_LEVEL[level];
    const skill = existingCard ? existingCard.skill : SKILLS[level][0].id;
    const format = existingCard ? existingCard.format : 'classique';

    const prob = generateProblem(skill, limit, format);

    return {
      id,
      playerName: PLAYER_DEFAULT_NAMES[id] || `Élève ${id + 1}`,
      level,
      skill,
      limit,
      format,
      n1: prob.n1,
      n2: prob.n2,
      op: prob.op,
      ans: prob.ans,
      expected: prob.expected,
      display: prob.displayHtml,
      subtype: prob.subtype,
      roundedN1: prob.roundedN1,
      roundedN2: prob.roundedN2,
      userAnswer: '',
      isFlipped: false,
      isCorrect: null,
      score: existingCard ? existingCard.score : 0,
      streak: existingCard ? existingCard.streak : 0,
      attempts: 0,
    };
  }, []);

  const [cards, setCards] = useState<CardState[]>(() => [createInitialCardState(0)]);

  // Stop Timer helper
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start Timer helper
  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(settings.sprintDuration);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        if (prev <= 6 && settings.soundEnabled) {
          playTickSound();
        }
        return prev - 1;
      });
    }, 1000);
  }, [settings.sprintDuration, settings.soundEnabled, stopTimer]);

  // Handle Sprint Time End -> Auto Flip/Verify
  useEffect(() => {
    if (mode === 'sprint' && timeLeft === 0 && !isGlobalFlipped) {
      // Auto verify all
      setCards((prevCards) =>
        prevCards.map((c) => {
          const isCorrect = checkIsCorrect(c.userAnswer, c.expected);
          if (isCorrect && settings.soundEnabled) {
            playSuccessSound();
          }
          return {
            ...c,
            isFlipped: true,
            isCorrect,
            score: isCorrect ? c.score + 1 : c.score,
            streak: isCorrect ? c.streak + 1 : 0,
          };
        })
      );
      setIsGlobalFlipped(true);

      if (settings.soundEnabled) {
        playFanfareSound();
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [timeLeft, mode, isGlobalFlipped, settings.soundEnabled]);

  // Handle player count changes
  const handleSetPlayers = (count: number) => {
    setPlayersCount(count);
    setCards((prev) => {
      const nextCards: CardState[] = [];
      for (let i = 0; i < count; i++) {
        nextCards.push(createInitialCardState(i, prev[i]));
      }
      return nextCards;
    });

    setIsGlobalFlipped(false);
    if (mode === 'sprint') {
      startTimer();
    }
  };

  // Mode change
  const handleSetMode = (newMode: GameMode) => {
    setMode(newMode);
    setIsGlobalFlipped(false);
    if (newMode === 'sprint') {
      startTimer();
    } else {
      stopTimer();
    }
  };

  // Regenerate single card problem
  const handleRegenerate = (id: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const prob = generateProblem(c.skill, c.limit, c.format);
        return {
          ...c,
          n1: prob.n1,
          n2: prob.n2,
          op: prob.op,
          ans: prob.ans,
          expected: prob.expected,
          display: prob.displayHtml,
          subtype: prob.subtype,
          roundedN1: prob.roundedN1,
          roundedN2: prob.roundedN2,
          userAnswer: '',
          isFlipped: false,
          isCorrect: null,
        };
      })
    );
  };

  // Update card Level
  const handleUpdateLevel = (id: number, newLevel: Level) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const skill = SKILLS[newLevel][0].id;
        const limit = LIMITS_PER_LEVEL[newLevel];
        const prob = generateProblem(skill, limit, c.format);
        return {
          ...c,
          level: newLevel,
          skill,
          limit,
          n1: prob.n1,
          n2: prob.n2,
          op: prob.op,
          ans: prob.ans,
          expected: prob.expected,
          display: prob.displayHtml,
          subtype: prob.subtype,
          roundedN1: prob.roundedN1,
          roundedN2: prob.roundedN2,
          userAnswer: '',
          isFlipped: false,
          isCorrect: null,
        };
      })
    );
  };

  // Update card setting fields
  const handleUpdateCardSettings = (id: number, updates: Partial<CardState>) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, ...updates };

        // If skill, limit, or format changed, regenerate problem
        if (
          updates.skill !== undefined ||
          updates.limit !== undefined ||
          updates.format !== undefined
        ) {
          const prob = generateProblem(updated.skill, updated.limit, updated.format);
          updated.n1 = prob.n1;
          updated.n2 = prob.n2;
          updated.op = prob.op;
          updated.ans = prob.ans;
          updated.expected = prob.expected;
          updated.display = prob.displayHtml;
          updated.subtype = prob.subtype;
          updated.roundedN1 = prob.roundedN1;
          updated.roundedN2 = prob.roundedN2;
          updated.userAnswer = '';
          updated.isFlipped = false;
          updated.isCorrect = null;
        }

        return updated;
      })
    );
  };

  // Single Card Verify
  const handleVerify = (id: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const isCorrect = checkIsCorrect(c.userAnswer, c.expected);

        if (settings.soundEnabled) {
          if (isCorrect) playSuccessSound();
          else playErrorSound();
        }

        if (isCorrect) {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
          });
        }

        return {
          ...c,
          isFlipped: true,
          isCorrect,
          score: isCorrect ? c.score + 1 : c.score,
          streak: isCorrect ? c.streak + 1 : 0,
        };
      })
    );
  };

  // Clear single card input
  const handleClear = (id: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, userAnswer: '' } : c))
    );
  };

  // Flip back single card and generate next problem
  const handleFlipBack = (id: number) => {
    handleRegenerate(id);
  };

  // Toggle All Cards (Global Verify vs Next Round)
  const handleToggleAll = () => {
    if (!isGlobalFlipped) {
      // Verify All Cards
      let allCorrect = true;
      setCards((prev) =>
        prev.map((c) => {
          const isCorrect = checkIsCorrect(c.userAnswer, c.expected);
          if (!isCorrect) allCorrect = false;

          return {
            ...c,
            isFlipped: true,
            isCorrect,
            score: isCorrect ? c.score + 1 : c.score,
            streak: isCorrect ? c.streak + 1 : 0,
          };
        })
      );

      setIsGlobalFlipped(true);
      stopTimer();

      if (settings.soundEnabled) {
        if (allCorrect) playFanfareSound();
        else playSuccessSound();
      }

      confetti({
        particleCount: allCorrect ? 100 : 50,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      // Next Round for All
      setCards((prev) =>
        prev.map((c) => {
          const prob = generateProblem(c.skill, c.limit, c.format);
          return {
            ...c,
            n1: prob.n1,
            n2: prob.n2,
            op: prob.op,
            ans: prob.ans,
            expected: prob.expected,
            display: prob.displayHtml,
            subtype: prob.subtype,
            roundedN1: prob.roundedN1,
            roundedN2: prob.roundedN2,
            userAnswer: '',
            isFlipped: false,
            isCorrect: null,
          };
        })
      );

      setIsGlobalFlipped(false);
      if (mode === 'sprint') {
        startTimer();
      }
    }
  };

  // Reset all scores
  const handleResetAllScores = () => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        score: 0,
        streak: 0,
      }))
    );
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <Header
        playersCount={playersCount}
        onSetPlayers={handleSetPlayers}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Global Controls */}
      <ControlsBar
        mode={mode}
        onSetMode={handleSetMode}
        timeLeft={timeLeft}
        sprintDuration={settings.sprintDuration}
        isGlobalFlipped={isGlobalFlipped}
        onToggleAll={handleToggleAll}
      />

      {/* Main Workspace (Grid of player cards) */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar w-full bg-slate-900/60">
        <div
          className={`grid gap-4 md:gap-6 h-full w-full ${
            playersCount === 1
              ? 'grid-cols-1 max-w-3xl mx-auto'
              : playersCount === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-none'
              : playersCount === 3
              ? 'grid-cols-1 md:grid-cols-3 max-w-none'
              : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 max-w-none'
          }`}
        >
          {cards.map((card) => (
            <PlayerCard
              key={card.id}
              card={card}
              playersCount={playersCount}
              onUpdateCardSettings={handleUpdateCardSettings}
              onUpdateLevel={handleUpdateLevel}
              onRegenerate={handleRegenerate}
              onVerify={handleVerify}
              onClear={handleClear}
              onFlipBack={handleFlipBack}
            />
          ))}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        onResetAllScores={handleResetAllScores}
      />
    </div>
  );
}
