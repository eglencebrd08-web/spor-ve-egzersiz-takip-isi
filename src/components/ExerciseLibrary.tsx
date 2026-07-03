import React, { useState, useRef, useEffect } from "react";
import { EXERCISE_LIBRARY, LibraryExercise } from "../data/exercises";
import { Exercise } from "../types";
import { 
  Search, 
  Dumbbell, 
  Target, 
  Flame, 
  ChevronRight, 
  Award, 
  Sparkles,
  Info,
  Play,
  Pause,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Tv,
  AudioLines,
  ArrowLeft
} from "lucide-react";

interface ExerciseLibraryProps {
  onStartExercise: (exercise: Exercise, workoutName: string) => void;
}

export default function ExerciseLibrary({ onStartExercise }: ExerciseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Tümü");
  const [selectedExercise, setSelectedExercise] = useState<LibraryExercise>(EXERCISE_LIBRARY[0]);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const [activeHotspotIndex, setActiveHotspotIndex] = useState<number>(0);

  useEffect(() => {
    setActiveHotspotIndex(0);
  }, [selectedExercise]);

  // Handle filtering
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.targetMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "Tümü" || ex.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "Tümü" || ex.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleStartExercise = (ex: LibraryExercise) => {
    const exerciseToStart: Exercise = {
      name: ex.name,
      sets: 3,
      reps: ex.category === 'Kardiyo' || ex.category === 'Karın / Merkez' ? "45 Saniye" : "12 Tekrar",
      notes: "Kütüphaneden başlatılan bilimsel seans.",
      targetMuscle: ex.targetMuscles[0] || "Tüm Vücut",
      estimatedCaloriesBurned: ex.caloriesPerMinute * 10 // estimate 10 mins workout
    };
    onStartExercise(exerciseToStart, "Hızlı Seans: " + ex.name);
  };

  return (
    <div className="space-y-6" id="exercise-library-tab">
      
      {/* Title block */}
      <div>
        <h2 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-[#D4FF00]" />
          BİLİMSEL EGZERSİZ REHBERİ
        </h2>
        <p className="text-zinc-400 text-xs mt-1">
          Hatalı formları engellemek için akıllı AI video analizleri, doğru duruş ve sesli anlatım tekniklerini inceleyin.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Filters & Exercise List (5 columns for layout balance) */}
        <div className={`lg:col-span-5 space-y-4 ${isDetailViewOpen ? "hidden lg:block" : "block"}`}>
          
          {/* Search and Filters Bar */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Egzersiz adı veya kas grubu arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700/60 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
              />
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Tümü", "Kardiyo", "Güç", "Karın / Merkez", "Esneklik"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                    selectedCategory === cat 
                      ? "bg-[#D4FF00] text-black" 
                      : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Categories */}
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/60">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Zorluk:</span>
              <div className="flex gap-1">
                {["Tümü", "Başlangıç", "Orta", "İleri"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                      selectedDifficulty === diff 
                        ? "bg-zinc-700 text-white" 
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Directory List */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredExercises.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-[2rem] text-zinc-500">
                <Info className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                <p className="text-xs font-semibold">Aradığınız kriterlere uygun hareket bulunamadı.</p>
                <p className="text-[10px] text-zinc-600 mt-1">Lütfen filtreleri temizleyip tekrar arayın.</p>
              </div>
            ) : (
              filteredExercises.map((ex) => (
                <div 
                  key={ex.id}
                  onClick={() => {
                    setSelectedExercise(ex);
                    setIsDetailViewOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`border p-4 rounded-2xl flex items-center justify-between transition cursor-pointer text-left ${
                    selectedExercise?.id === ex.id 
                      ? "bg-zinc-900 border-[#D4FF00] shadow-[0_0_15px_rgba(212,255,0,0.05)]" 
                      : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      ex.category === 'Kardiyo' ? 'bg-blue-950/50 text-blue-400' :
                      ex.category === 'Güç' ? 'bg-red-950/50 text-red-400' :
                      ex.category === 'Esneklik' ? 'bg-indigo-950/50 text-indigo-400' :
                      'bg-amber-950/50 text-amber-400'
                    }`}>
                      {ex.category === 'Kardiyo' ? "🏃" :
                       ex.category === 'Güç' ? "💪" :
                       ex.category === 'Esneklik' ? "🧘" : "⚡"}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">{ex.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-semibold text-zinc-500 font-mono">
                          {ex.category}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className={`text-[10px] font-bold ${
                          ex.difficulty === 'Başlangıç' ? 'text-emerald-400' :
                          ex.difficulty === 'Orta' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {ex.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition ${
                    selectedExercise?.id === ex.id ? 'text-[#D4FF00]' : 'text-zinc-600'
                  }`} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Interactive Visual AI Coach Video Viewer (7 columns for cinematic focus) */}
        <div className={`lg:col-span-7 ${isDetailViewOpen ? "block" : "hidden lg:block"}`}>
          {selectedExercise ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-6 sm:p-8 space-y-6 sticky top-6">
              
              {/* Back button on mobile */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsDetailViewOpen(false)}
                  className="flex items-center gap-2 bg-zinc-950 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer border border-zinc-800 hover:border-[#D4FF00] hover:text-[#D4FF00] shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 text-[#D4FF00]" />
                  ← Geri Dön (Egzersiz Listesi)
                </button>
              </div>
              
              {/* Top Meta info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest bg-zinc-800 text-[#D4FF00] px-2.5 py-1 rounded-md uppercase">
                    AI EĞİTİM MODÜLÜ
                  </span>
                  <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase animate-pulse">
                    LIVE DEMO
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1 bg-orange-950/30 px-2 py-0.5 rounded-lg border border-orange-900/30">
                  <Flame className="w-3.5 h-3.5 fill-orange-400/20" />
                  {selectedExercise.caloriesPerMinute} kcal / dk
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-2xl font-black italic text-white tracking-tight uppercase flex items-center gap-2">
                  {selectedExercise.name}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                  {selectedExercise.description}
                </p>
              </div>

              {/* ----------------- INTERACTIVE POSTURE TEXT-BASED HOTSPOTS SELECTOR ----------------- */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-[#D4FF00]">
                  <Target className="w-5 h-5" />
                  <h4 className="font-extrabold text-xs sm:text-sm tracking-tight uppercase italic">
                    Kritik Postür & Anatomik Kontrol Noktaları ({selectedExercise.hotspots?.length || 0} Bölge)
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Aşağıdaki kontrol noktalarından birini seçerek doğru duruş ve sakatlanma önleyici ipuçlarını detaylı olarak inceleyin:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedExercise.hotspots && selectedExercise.hotspots.map((hotspot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveHotspotIndex(idx)}
                      onMouseEnter={() => setActiveHotspotIndex(idx)}
                      className={`p-3 rounded-xl border text-left transition duration-150 flex items-start gap-2.5 ${
                        activeHotspotIndex === idx 
                          ? "bg-[#D4FF00]/10 border-[#D4FF00] text-white" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                        activeHotspotIndex === idx ? "bg-[#D4FF00] text-black" : "bg-zinc-800 text-zinc-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black tracking-tight">{hotspot.label}</p>
                        <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[150px]">{hotspot.tip}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ----------------- INTERACTIVE HOTSPOT DETAIL TOOLBOX ----------------- */}
              {selectedExercise.hotspots && selectedExercise.hotspots[activeHotspotIndex] && (
                <div className="bg-[#D4FF00]/5 border-2 border-[#D4FF00]/20 rounded-3xl p-5 space-y-2 relative overflow-hidden transition-all duration-300">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Target className="w-24 h-24 text-[#D4FF00]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#D4FF00] text-black font-black text-xs flex items-center justify-center">
                      {activeHotspotIndex + 1}
                    </span>
                    <h4 className="text-xs font-black text-[#D4FF00] uppercase tracking-wider font-mono">
                      AKTİF POSTÜR KONTROLÜ: {selectedExercise.hotspots[activeHotspotIndex].label}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-100 leading-relaxed font-semibold">
                    {selectedExercise.hotspots[activeHotspotIndex].tip}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    💡 İpucu: Diğer duruş ve eklem kurallarını görmek için yukarıdaki listelenen kontrol noktalarından birine tıklayabilirsiniz.
                  </p>
                </div>
              )}

              {/* ----------------- ANTRENÖRÜN TAKTİK KÖŞESİ ----------------- */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                  <div className="w-9 h-9 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#D4FF00]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {selectedExercise.coachName}
                    </h4>
                    <p className="text-[9px] text-zinc-500">Antrenörün Form ve Uygulama Taktikleri</p>
                  </div>
                </div>

                <div className="relative">
                  <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/50">
                    "{selectedExercise.coachNotes}"
                  </p>
                </div>
              </div>

              {/* ----------------- SAFETY & FORM WARNING CHECKS (RED & WHITE THEME) ----------------- */}
              <div className="bg-white text-zinc-950 rounded-3xl border-4 border-red-600 p-5 sm:p-6 space-y-4 shadow-xl">
                
                {/* Header red bar */}
                <div className="flex items-center gap-2 text-red-600 border-b border-red-100 pb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <h4 className="font-extrabold text-sm sm:text-base tracking-tight uppercase italic">
                    HAREKETİ YAPARKEN NELERE DİKKAT EDİLMELİ? (GÜVENLİK REHBERİ)
                  </h4>
                </div>

                {/* Grid for Mistakes vs Correct posture rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Left: Accurate Posture Guidelines */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-emerald-600 flex items-center gap-1.5 tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Doğru Form Kuralları
                    </h5>
                    <ul className="space-y-2">
                      {selectedExercise.safetyTips.map((tip, i) => (
                        <li key={i} className="flex gap-2 items-start text-[11px] font-semibold text-zinc-800 leading-relaxed">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Crucial Mistakes to Avoid */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black uppercase text-red-600 flex items-center gap-1.5 tracking-wider">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      Yapılan Yaygın Hatalar
                    </h5>
                    <ul className="space-y-2">
                      {selectedExercise.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex gap-2 items-start text-[11px] font-semibold text-zinc-800 leading-relaxed bg-red-50/70 p-2 rounded-xl border border-red-100/50">
                          <span className="text-red-500 mt-0.5">⚠️</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>

              {/* Steps (Clean List Display) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#D4FF00]" />
                  Nasıl Yapılır? (Adım Adım):
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedExercise.steps.map((step, index) => (
                    <div 
                      key={index} 
                      className="flex gap-3.5 items-start bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#D4FF00] text-black font-black text-xs flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(212,255,0,0.2)]">
                        {index + 1}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">Adım {index + 1}</span>
                        <p className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed font-semibold">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start training triggers */}
              <button
                onClick={() => handleStartExercise(selectedExercise)}
                className="w-full bg-[#D4FF00] hover:bg-[#bce600] text-black font-black italic tracking-tighter py-3.5 rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer shadow-lg hover:scale-[1.01]"
              >
                <Flame className="w-5 h-5" /> Bu Hareketi Hemen Başlat
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-12 text-center text-zinc-500 h-[500px] flex flex-col items-center justify-center">
              <Dumbbell className="w-12 h-12 mb-3 text-zinc-700 animate-pulse" />
              <p className="text-sm font-medium">Lütfen detaylarını görüntülemek istediğiniz bir egzersiz seçin.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
