import React, { useState, useEffect, useRef } from "react";
import { Exercise, LoggedWorkout } from "../types";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Flame, 
  Award, 
  Clock, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle,
  HelpCircle,
  Activity
} from "lucide-react";

interface ActiveSessionProps {
  activeExercise: Exercise | null;
  workoutName: string;
  onLogWorkout: (workout: Omit<LoggedWorkout, 'id' | 'date'>) => void;
  onCancelSession: () => void;
}

export default function ActiveSession({ activeExercise, workoutName, onLogWorkout, onCancelSession }: ActiveSessionProps) {
  // Timer States
  const [timeLeft, setTimeLeft] = useState<number>(45); // default countdown seconds
  const [initialTime, setInitialTime] = useState<number>(45);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSets, setCompletedSets] = useState<boolean[]>([false, false, false]);
  const [workoutMinutes, setWorkoutMinutes] = useState<number>(10); // user can change duration spent
  const [caloriesOverride, setCaloriesOverride] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set default state based on exercise
  useEffect(() => {
    if (activeExercise) {
      // If reps mentions a duration like "45 saniye"
      const secondsMatch = activeExercise.reps.match(/(\d+)\s*saniye/);
      if (secondsMatch) {
        const secs = parseInt(secondsMatch[1]);
        setTimeLeft(secs);
        setInitialTime(secs);
        setIsCountingDown(true);
      } else {
        // Default stopwatch-like mode
        setTimeLeft(0);
        setIsCountingDown(false);
      }

      // Initialize completed sets based on sets counts
      setCompletedSets(Array(activeExercise.sets).fill(false));
    }
  }, [activeExercise]);

  // Dynamically estimate calories based on duration and chosen exercise
  useEffect(() => {
    if (activeExercise) {
      // baseCalRate is calories per minute (assuming estimatedCaloriesBurned is for approx 10 mins)
      const baseCalRate = (activeExercise.estimatedCaloriesBurned || 50) / 10;
      const estimated = Math.round(baseCalRate * workoutMinutes);
      setCaloriesOverride(estimated.toString());
    } else {
      // Free session default rate is 8 kcal per minute
      const estimated = Math.round(8 * workoutMinutes);
      setCaloriesOverride(estimated.toString());
    }
  }, [workoutMinutes, activeExercise]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (isCountingDown) {
            if (prev <= 1) {
              setIsRunning(false);
              // Simple sound beep indicator using Web Audio API!
              playBeepSound();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isCountingDown]);

  // Gentle synthesizer sound feedback using Web Audio API
  const playBeepSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime); // high A pitch
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by user action.", e);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isCountingDown ? initialTime : 0);
  };

  const toggleSet = (index: number) => {
    const updated = [...completedSets];
    updated[index] = !updated[index];
    setCompletedSets(updated);
    
    // play a soft feedback beep
    playBeepSound();
  };

  const handleCompleteWorkout = () => {
    const defaultCal = activeExercise ? activeExercise.estimatedCaloriesBurned : 150;
    const finalCals = parseInt(caloriesOverride) || defaultCal;
    const finalMinutes = workoutMinutes || 10;

    onLogWorkout({
      name: activeExercise ? `${activeExercise.name} (${workoutName})` : workoutName,
      durationMinutes: finalMinutes,
      caloriesBurned: finalCals,
      type: activeExercise?.targetMuscle.toLowerCase().includes('kardiyo') ? 'Cardio' : 'Strength',
      notes: notes || `${completedSets.filter(Boolean).length}/${completedSets.length} set başarıyla tamamlandı.`
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine workout circular progress
  const progressPercent = isCountingDown 
    ? ((initialTime - timeLeft) / initialTime) * 100 
    : 100;

  return (
    <div className="space-y-6" id="active-session-tab">
      <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
        <div>
          <span className="text-[10px] font-black tracking-widest bg-[#D4FF00] text-black px-2.5 py-0.5 rounded-md">
            CANLI ANTREMAN SEANSI
          </span>
          <h2 className="text-xl font-black italic text-white tracking-tighter mt-1">
            {activeExercise ? activeExercise.name : "Serbest Antrenman Seansı"}
          </h2>
        </div>
        <button 
          onClick={onCancelSession}
          className="text-xs text-zinc-400 hover:text-white border border-zinc-800 px-3 py-1.5 rounded-xl transition"
        >
          Seansı Sonlandır
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Active Timer & Circular Visualization (7 Columns) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center justify-center text-center">
          
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-6">
            {workoutName}
          </p>

          {/* Interactive Circle Progress Timer */}
          <div className="relative w-64 h-64 md:w-72 md:h-72">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="44" 
                fill="none" 
                stroke="#1f1f23" 
                strokeWidth="6" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="44" 
                fill="none" 
                stroke="#D4FF00" 
                strokeWidth="6" 
                strokeDasharray="276" 
                strokeDashoffset={276 - (276 * progressPercent) / 100} 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl md:text-6xl font-black text-white font-mono tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4FF00] mt-1.5 flex items-center gap-1">
                {isRunning ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-pulse text-red-500" />
                    Çalışıyor
                  </>
                ) : "Duraklatıldı"}
              </span>
            </div>
          </div>

          {/* Timer Controls Row */}
          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleReset}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl transition"
              title="Sıfırla"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleStartPause}
              className={`px-8 py-3 rounded-2xl font-black italic tracking-tighter transition flex items-center gap-2 ${
                isRunning 
                  ? "bg-amber-500 text-black hover:bg-amber-600" 
                  : "bg-[#D4FF00] text-black hover:bg-[#bce600]"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-black" />
                  DURAKLAT
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black" />
                  BAŞLAT
                </>
              )}
            </button>
          </div>

          {/* Toggle modes */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => {
                setIsRunning(false);
                setIsCountingDown(true);
                setTimeLeft(45);
                setInitialTime(45);
              }}
              className={`text-[10px] font-bold px-3 py-1 rounded ${isCountingDown ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              45 Saniye Geri Sayım
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setIsCountingDown(false);
                setTimeLeft(0);
              }}
              className={`text-[10px] font-bold px-3 py-1 rounded ${!isCountingDown ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
            >
              Kronometre
            </button>
          </div>
        </div>

        {/* Right Panel: Sets Progress Tracker & Completion Details (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sets Tracker */}
          {activeExercise && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 space-y-4">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#D4FF00]" />
                Hedef Setleri Tamamla ({activeExercise.sets} Set)
              </h3>
              
              <div className="space-y-2.5">
                {completedSets.map((isDone, idx) => (
                  <div 
                    key={idx}
                    onClick={() => toggleSet(idx)}
                    className={`border rounded-2xl p-3.5 flex justify-between items-center cursor-pointer transition ${
                      isDone 
                        ? "bg-[#D4FF00]/10 border-[#D4FF00] text-[#D4FF00]" 
                        : "bg-zinc-800/40 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center ${
                        isDone ? 'bg-[#D4FF00] text-black' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        S{idx + 1}
                      </span>
                      <span className="text-xs font-bold">Set {idx + 1}: <strong className="font-mono">{activeExercise.reps}</strong> Tekrar</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isDone ? 'bg-[#D4FF00] border-[#D4FF00]' : 'border-zinc-700'
                    }`}>
                      {isDone && <Check className="w-3 h-3 text-black stroke-[3px]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calorie & Duration Inputs for Log */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" />
              Seans İstatistikleri
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500">Spor Süresi (Dakika)</label>
                <input 
                  type="number" 
                  value={workoutMinutes}
                  onChange={(e) => setWorkoutMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                  placeholder="Dakika"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-500">Yakılan Kalori (kcal)</label>
                <input 
                  type="number" 
                  value={caloriesOverride}
                  onChange={(e) => setCaloriesOverride(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                  placeholder="Kalori"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-500">Kişisel Seans Notu</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Bugün harika hissettim, formuma dikkat ettim..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00] h-16 resize-none"
              />
            </div>

            <button
              onClick={handleCompleteWorkout}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black italic tracking-tighter py-3.5 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg mt-2"
            >
              <Check className="w-5 h-5 stroke-[2.5px]" /> ANTREMANI BAŞARIYLA TAMAMLA & GÜNLÜĞE YAZ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
