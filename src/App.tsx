import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AiPlanner from "./components/AiPlanner";
import ExerciseLibrary from "./components/ExerciseLibrary";
import ActiveSession from "./components/ActiveSession";
import CalorieCalculator from "./components/CalorieCalculator";
import { DailyStats, LoggedWorkout, WorkoutPlan, Exercise } from "./types";
import { 
  Flame, 
  Droplets, 
  Compass, 
  Dumbbell, 
  Sparkles, 
  Activity, 
  Calendar, 
  User,
  Plus,
  Scale,
  Settings,
  X,
  Calculator,
  ArrowLeft
} from "lucide-react";

const LOCAL_STORAGE_STATS_KEY = "strive_app_daily_stats_v1";
const LOCAL_STORAGE_HISTORY_KEY = "strive_app_workout_history_v1";
const LOCAL_STORAGE_PLAN_KEY = "strive_app_saved_plan_v1";
const LOCAL_STORAGE_PROFILE_KEY = "strive_app_profile_name_v1";

const DEFAULT_STATS: DailyStats = {
  caloriesBurnedGoal: 500,
  waterGoalCups: 8,
  waterIntakeCups: 0,
  calorieIntake: 0,
  calorieGoal: 2300,
  weightHistory: [],
  currentWeight: 75,
  streakDays: 3,
  totalPoints: 1450
};

const DEFAULT_HISTORY: LoggedWorkout[] = [];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'library' | 'active' | 'calorie'>('dashboard');
  
  // App core persistent states
  const [stats, setStats] = useState<DailyStats>(DEFAULT_STATS);
  const [workoutHistory, setWorkoutHistory] = useState<LoggedWorkout[]>(DEFAULT_HISTORY);
  const [savedPlan, setSavedPlan] = useState<WorkoutPlan | null>(null);
  const [profileName, setProfileName] = useState<string>("Mert Karabulut");

  // Active workout temporary state
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [activeWorkoutName, setActiveWorkoutName] = useState<string>("Genel Antrenman");

  // Profile Edit modal
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [tempProfileName, setTempProfileName] = useState("");
  const [tempCalorieGoal, setTempCalorieGoal] = useState("");
  const [tempWaterGoal, setTempWaterGoal] = useState("");
  const [tempBurnedGoal, setTempBurnedGoal] = useState("");

  // Load from localstorage on mount
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      } else {
        localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(DEFAULT_STATS));
      }

      const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (storedHistory) {
        setWorkoutHistory(JSON.parse(storedHistory));
      } else {
        localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(DEFAULT_HISTORY));
      }

      const storedPlan = localStorage.getItem(LOCAL_STORAGE_PLAN_KEY);
      if (storedPlan) {
        setSavedPlan(JSON.parse(storedPlan));
      }

      const storedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (storedProfile) {
        setProfileName(storedProfile);
      }
    } catch (e) {
      console.error("Local storage reading error:", e);
    }
  }, []);

  // Save to localstorage when state updates
  const updateStatsState = (updater: (prev: DailyStats) => DailyStats) => {
    setStats((prev) => {
      const updated = { ...updater(prev) };
      
      // Centralized Point Reward Interceptor
      // If water intake increased, award points (15 points per cup of water added)
      if (updated.waterIntakeCups > prev.waterIntakeCups) {
        const cupsDiff = updated.waterIntakeCups - prev.waterIntakeCups;
        const currentPoints = updated.totalPoints !== undefined ? updated.totalPoints : 1450;
        updated.totalPoints = currentPoints + Math.round(cupsDiff * 15);
      }

      localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSavePlan = (plan: WorkoutPlan) => {
    setSavedPlan(plan);
    if (plan) {
      localStorage.setItem(LOCAL_STORAGE_PLAN_KEY, JSON.stringify(plan));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PLAN_KEY);
    }
  };

  const handleDeleteWorkout = (id: string) => {
    const updatedHistory = workoutHistory.filter(w => w.id !== id);
    setWorkoutHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  // Launch exercise into active tracker
  const handleStartExercise = (exercise: Exercise, workoutName: string) => {
    setActiveExercise(exercise);
    setActiveWorkoutName(workoutName);
    setActiveTab('active');
  };

  // On Complete workout session
  const handleLogWorkout = (newWorkout: Omit<LoggedWorkout, 'id' | 'date'>) => {
    const fullWorkout: LoggedWorkout = {
      ...newWorkout,
      id: "w-" + Date.now(),
      date: new Date().toISOString()
    };

    const updatedHistory = [fullWorkout, ...workoutHistory];
    setWorkoutHistory(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));

    // Update daily stats (burn calories, check streaks, update points)
    updateStatsState(prev => {
      // Simple streak increment logic: if last workout was yesterday or today, keep/increment streak
      const todayStr = new Date().toISOString().split('T')[0];
      const hadWorkoutToday = workoutHistory.some(w => new Date(w.date).toISOString().split('T')[0] === todayStr);
      
      let newStreak = prev.streakDays;
      if (!hadWorkoutToday) {
        newStreak += 1; // Increment streak with first workout of the day
      }

      // Calculate points earned from the workout (e.g. 1.5 * caloriesBurned + 10 * duration)
      const cal = newWorkout.caloriesBurned || 150;
      const dur = newWorkout.durationMinutes || 20;
      const pointsGained = Math.round(cal * 1.5 + dur * 10);
      const currentPoints = prev.totalPoints !== undefined ? prev.totalPoints : 1450;
      const newPoints = currentPoints + pointsGained;

      return {
        ...prev,
        streakDays: newStreak,
        totalPoints: newPoints
      };
    });

    // Reset active exercise
    setActiveExercise(null);
    // Return to dashboard
    setActiveTab('dashboard');
  };

  // Settings / Profile save
  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempProfileName.trim()) {
      setProfileName(tempProfileName);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, tempProfileName);
    }

    const cGoal = parseInt(tempCalorieGoal);
    const wGoal = parseInt(tempWaterGoal);
    const bGoal = parseInt(tempBurnedGoal);

    updateStatsState(prev => ({
      ...prev,
      calorieGoal: isNaN(cGoal) ? prev.calorieGoal : cGoal,
      waterGoalCups: isNaN(wGoal) ? prev.waterGoalCups : wGoal,
      caloriesBurnedGoal: isNaN(bGoal) ? prev.caloriesBurnedGoal : bGoal
    }));

    setShowProfileEdit(false);
  };

  const openProfileModal = () => {
    setTempProfileName(profileName);
    setTempCalorieGoal(stats.calorieGoal.toString());
    setTempWaterGoal(stats.waterGoalCups.toString());
    setTempBurnedGoal(stats.caloriesBurnedGoal.toString());
    setShowProfileEdit(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans p-4 sm:p-8" id="app-root">
      
      {/* Header Container */}
      <header className="max-w-7xl w-full mx-auto flex justify-between items-center mb-8 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mr-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white p-2.5 rounded-xl border border-zinc-800 transition duration-150 flex items-center justify-center cursor-pointer shadow-sm"
              title="Geri Dön (Ana Ekran)"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4FF00]" />
            </button>
          )}
          <div className="w-10 h-10 bg-[#D4FF00] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,255,0,0.4)]">
            <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-[#D4FF00]">STRIVE.</h1>
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Kişisel Fitness Asistanı</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Hoş geldin,</p>
            <button 
              onClick={openProfileModal}
              className="font-black italic text-sm text-white hover:text-[#D4FF00] flex items-center gap-1 group transition"
            >
              {profileName}
              <Settings className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#D4FF00]" />
            </button>
          </div>

          <button 
            onClick={openProfileModal}
            className="w-11 h-11 rounded-full border-2 border-[#D4FF00] p-0.5 shadow-[0_0_10px_rgba(212,255,0,0.15)] focus:outline-none hover:scale-105 transition"
          >
            <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-xs font-black text-[#D4FF00] font-mono">
              {profileName.substring(0, 2).toUpperCase()}
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="max-w-7xl w-full mx-auto flex-1 min-h-0 bg-zinc-950">
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            workoutHistory={workoutHistory} 
            onUpdateStats={updateStatsState}
            onDeleteWorkout={handleDeleteWorkout}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            profileName={profileName}
          />
        )}

        {activeTab === 'planner' && (
          <AiPlanner 
            savedPlan={savedPlan}
            onSavePlan={handleSavePlan}
            onStartExercise={handleStartExercise}
          />
        )}

        {activeTab === 'library' && (
          <ExerciseLibrary 
            onStartExercise={handleStartExercise}
          />
        )}

        {activeTab === 'calorie' && (
          <CalorieCalculator 
            currentWeight={stats.currentWeight}
            onUpdateCalorieGoal={(newGoal) => {
              updateStatsState(prev => ({
                ...prev,
                calorieGoal: newGoal
              }));
            }}
          />
        )}

        {activeTab === 'active' && (
          <ActiveSession 
            activeExercise={activeExercise}
            workoutName={activeWorkoutName}
            onLogWorkout={handleLogWorkout}
            onCancelSession={() => {
              setActiveExercise(null);
              setActiveTab('dashboard');
            }}
          />
        )}
      </main>

      {/* Custom Bottom Tab bar mimicking Vibrant Palette design */}
      <nav className="mt-12 flex justify-center sticky bottom-4 z-40">
        <div className="bg-zinc-900/90 backdrop-blur-xl px-3 sm:px-10 py-3 rounded-full border border-zinc-800/80 flex gap-2 sm:gap-10 items-center justify-center shadow-2xl">
          {/* Dashboard Tab button */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-xl transition ${
              activeTab === 'dashboard' ? 'text-[#D4FF00]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Gösterge Paneli"
          >
            <Compass className="w-5 h-5 sm:w-6 h-6 animate-pulse" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block">Takip</span>
          </button>

          {/* AI Planner Tab button */}
          <button 
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-xl transition ${
              activeTab === 'planner' ? 'text-[#D4FF00]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="AI Antrenör"
          >
            <Sparkles className="w-5 h-5 sm:w-6 h-6" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block">AI Program</span>
          </button>

          {/* Fast start active workout button (Unified Style with Text & Icon together) */}
          <button 
            onClick={() => {
              if (activeExercise) {
                setActiveTab('active');
              } else {
                // Free style workout fast start
                setActiveExercise(null);
                setActiveWorkoutName("Serbest Seans");
                setActiveTab('active');
              }
            }}
            className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-xl transition ${
              activeTab === 'active' ? 'text-[#D4FF00]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title={activeExercise ? "Aktif Seansa Dön" : "Serbest Antrenman Başlat"}
          >
            <Flame className={`w-5 h-5 sm:w-6 h-6 ${activeTab === 'active' ? 'animate-bounce' : ''}`} />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block">Aktif</span>
          </button>

          {/* Exercise Library Tab button */}
          <button 
            onClick={() => setActiveTab('library')}
            className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-xl transition ${
              activeTab === 'library' ? 'text-[#D4FF00]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Egzersiz Kütüphanesi"
          >
            <Dumbbell className="w-5 h-5 sm:w-6 h-6" />
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block">Kütüphane</span>
          </button>

          {/* Calorie Calculator Tab button */}
          <button 
            onClick={() => setActiveTab('calorie')}
            className={`flex flex-col items-center gap-1 px-2.5 sm:px-3.5 py-1 rounded-xl transition relative ${
              activeTab === 'calorie' 
                ? 'text-red-500 bg-white/5 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'text-zinc-500 hover:text-red-400'
            }`}
            title="Kalori Hesaplayıcı"
          >
            <div className="relative">
              <Calculator className="w-5 h-5 sm:w-6 h-6" />
              {activeTab !== 'calorie' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border border-zinc-950 animate-pulse"></span>
              )}
            </div>
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider block">Kalori</span>
          </button>
        </div>
      </nav>

      {/* Settings / Profile Update Modal overlay */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button 
              onClick={() => setShowProfileEdit(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition p-1 rounded-full bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black italic text-[#D4FF00] tracking-tight uppercase flex items-center gap-2">
                <Settings className="w-5 h-5" />
                PROFİL VE GÜNLÜK HEDEFLER
              </h3>
              <p className="text-xs text-zinc-400">Hedeflerinizi güncelleyerek gelişim yüzdelerinizi kişiselleştirin.</p>
            </div>

            <form onSubmit={handleSaveProfileSettings} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">İsminiz</label>
                <input 
                  type="text"
                  required
                  value={tempProfileName}
                  onChange={(e) => setTempProfileName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                  placeholder="Ad Soyad"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Günlük Yakılan Kalori Hedefi (kcal)</label>
                <input 
                  type="number"
                  required
                  value={tempBurnedGoal}
                  onChange={(e) => setTempBurnedGoal(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Günlük Beslenme Kalori Limiti (kcal)</label>
                <input 
                  type="number"
                  required
                  value={tempCalorieGoal}
                  onChange={(e) => setTempCalorieGoal(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Günlük Su Tüketim Hedefi (Bardak)</label>
                <input 
                  type="number"
                  required
                  value={tempWaterGoal}
                  onChange={(e) => setTempWaterGoal(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white py-3 rounded-xl text-xs font-bold transition"
                >
                  Vazgeç
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#D4FF00] hover:bg-[#bce600] text-black py-3 rounded-xl text-xs font-black italic tracking-tighter transition"
                >
                  DEĞİŞİKLİKLERİ KAYDET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
