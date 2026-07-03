import React, { useState } from "react";
import { DailyStats } from "../types";
import { 
  Calculator, 
  Flame, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  Check, 
  Info,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  RotateCcw
} from "lucide-react";

interface CalorieCalculatorProps {
  currentWeight?: number;
  currentHeight?: number;
  currentAge?: number;
  currentGender?: string;
  onUpdateCalorieGoal: (newGoal: number) => void;
}

export default function CalorieCalculator({ 
  currentWeight = 70, 
  currentHeight = 175, 
  currentAge = 25, 
  currentGender = "Erkek",
  onUpdateCalorieGoal 
}: CalorieCalculatorProps) {
  // Inputs
  const [gender, setGender] = useState<string>(currentGender);
  const [weight, setWeight] = useState<string>(currentWeight.toString());
  const [height, setHeight] = useState<string>(currentHeight.toString());
  const [age, setAge] = useState<string>(currentAge.toString());
  const [activity, setActivity] = useState<string>("1.375"); // Default: Hafif aktif
  const [goal, setGoal] = useState<string>("lose"); // lose, maintain, gain

  // Results state
  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    target: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);

  const [applied, setApplied] = useState<boolean>(false);

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const act = parseFloat(activity);

    if (isNaN(w) || isNaN(h) || isNaN(a)) return;

    // Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === "Erkek") {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = bmr * act;

    // Goal adjustments
    let target = tdee;
    if (goal === "lose") {
      target = tdee - 500; // 500 kcal deficit
    } else if (goal === "gain") {
      target = tdee + 400; // 400 kcal surplus
    }

    // Ensure safe minimum calories
    const safeMin = gender === "Erkek" ? 1500 : 1200;
    if (target < safeMin) {
      target = safeMin;
    }

    // Macronutrients Split (approximate)
    // 30% Protein, 40% Carbs, 30% Fat
    const proteinCal = target * 0.30;
    const carbsCal = target * 0.40;
    const fatCal = target * 0.30;

    const proteinGrams = proteinCal / 4;
    const carbsGrams = carbsCal / 4;
    const fatGrams = fatCal / 9;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      target: Math.round(target),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbsGrams),
      fat: Math.round(fatGrams)
    });
    setApplied(false);
  };

  const handleApplyGoal = () => {
    if (results) {
      onUpdateCalorieGoal(results.target);
      setApplied(true);
      // Automatically reset applied state after a while
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <div className="space-y-6" id="calorie-calculator-tab">
      
      {/* Red and White Accent Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-red-600 p-6 rounded-[2rem] border border-red-500 shadow-xl text-white">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
            <Calculator className="w-6 h-6 text-white" />
            BİLİMSEL KALORİ HESAPLAYICI (BMR & TDEE)
          </h2>
          <p className="text-red-100 text-xs mt-1">
            Mifflin-St Jeor formülüyle günlük bazal metabolizma hızınızı ve hedef kalori ihtiyacınızı hemen öğrenin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Form Column (Left - Red/White styled) */}
        <form onSubmit={calculateCalories} className="bg-white text-zinc-900 rounded-[2.5rem] p-6 md:p-8 border-4 border-red-600 shadow-2xl lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2 border-b-2 border-red-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-extrabold text-red-600 tracking-tight text-base sm:text-lg">
              Vücut Analiz Parametreleri
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGender("Erkek")}
              className={`py-3 rounded-xl text-xs font-black tracking-wider border-2 transition ${
                gender === "Erkek" 
                  ? "bg-red-600 border-red-600 text-white" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              ERKEK
            </button>
            <button
              type="button"
              onClick={() => setGender("Kadın")}
              className={`py-3 rounded-xl text-xs font-black tracking-wider border-2 transition ${
                gender === "Kadın" 
                  ? "bg-red-600 border-red-600 text-white" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              KADIN
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Mevcut Kilo (kg)</label>
            <input 
              type="number"
              step="0.1"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-950 focus:outline-none focus:border-red-600 focus:bg-white font-mono font-bold"
              placeholder="Örn: 74"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Boy Uzunluğu (cm)</label>
            <input 
              type="number"
              required
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-950 focus:outline-none focus:border-red-600 focus:bg-white font-mono font-bold"
              placeholder="Örn: 178"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Yaş</label>
            <input 
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-950 focus:outline-none focus:border-red-600 focus:bg-white font-mono font-bold"
              placeholder="Örn: 28"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Günlük Fiziksel Aktivite</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-950 focus:outline-none focus:border-red-600 focus:bg-white font-bold"
            >
              <option value="1.2">Hareketsiz (Masa başı iş, spor yapmıyor)</option>
              <option value="1.375">Hafif Aktif (Haftada 1-3 gün hafif egzersiz)</option>
              <option value="1.55">Orta Aktif (Haftada 3-5 gün yoğun egzersiz)</option>
              <option value="1.725">Çok Aktif (Haftada 6-7 gün ağır spor seansı)</option>
              <option value="1.9">Aşırı Aktif (Profesyonel sporcu / fiziksel ağır iş)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Kilo Hedefiniz</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-950 focus:outline-none focus:border-red-600 focus:bg-white font-bold"
            >
              <option value="lose">Kilo Vermek & Yağ Yakmak (Kalori Açığı)</option>
              <option value="maintain">Mevcut Kiloyu Korumak (Denge / Sağlıklı Yaşam)</option>
              <option value="gain">Kas Kazanmak & Kilo Almak (Kalori Fazlası)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic tracking-tighter py-3.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
          >
            <Calculator className="w-5 h-5" /> HESAPLA VE RAPORU GÖSTER
          </button>
        </form>

        {/* Results Column (Right - Red/White styled) */}
        <div className="lg:col-span-7 space-y-6">
          {results ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              {/* Header result banner */}
              <div className="bg-red-600 text-white p-6 sm:p-8 flex justify-between items-center relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 text-white/5 font-black text-9xl italic pointer-events-none select-none">
                  CAL
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest bg-white text-red-600 px-2.5 py-1 rounded-md uppercase">
                    KİŞİSEL KALORİ RAPORU
                  </span>
                  <h3 className="text-2xl font-black italic tracking-tighter mt-3">
                    HEDEF GÜNLÜK KALORİ ALIMI
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black font-mono tracking-tight text-white">
                    {results.target}
                  </div>
                  <div className="text-xs text-red-100 font-bold">kcal / gün</div>
                </div>
              </div>

              {/* Grid content */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* 3 Steps breakdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* BMR card */}
                  <div className="bg-zinc-800/50 border border-zinc-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Bazal Metabolizma Hızı (BMR)</p>
                    <p className="text-2xl font-extrabold text-white mt-1 font-mono">
                      {results.bmr} <span className="text-xs font-normal text-zinc-400">kcal</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                      Hiç hareket etmeden organlarınızın çalışması için vücudunuzun harcadığı minimum enerji miktarı.
                    </p>
                  </div>

                  {/* TDEE card */}
                  <div className="bg-zinc-800/50 border border-zinc-800 p-4 rounded-2xl">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Toplam Günlük Harcanan (TDEE)</p>
                    <p className="text-2xl font-extrabold text-white mt-1 font-mono">
                      {results.tdee} <span className="text-xs font-normal text-zinc-400">kcal</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                      Günlük fiziksel aktiviteleriniz, sporunuz ve metabolizma hızınız dahil toplam yakılan kalori.
                    </p>
                  </div>
                </div>

                {/* Macromolecules breakdown styled in RED / WHITE */}
                <div className="bg-white text-zinc-950 p-6 rounded-3xl border-2 border-red-600/80 space-y-4">
                  <h4 className="font-extrabold text-red-600 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Önerilen Günlük Makro Besin Değerleri (30/40/30)
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 p-3.5 rounded-2xl text-center border border-red-100">
                      <p className="text-[10px] font-black uppercase text-red-600">Protein</p>
                      <p className="text-lg font-black font-mono text-zinc-900 mt-1">{results.protein}g</p>
                      <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Kas Onarımı</p>
                    </div>

                    <div className="bg-red-50 p-3.5 rounded-2xl text-center border border-red-100">
                      <p className="text-[10px] font-black uppercase text-red-600">Karbonhidrat</p>
                      <p className="text-lg font-black font-mono text-zinc-900 mt-1">{results.carbs}g</p>
                      <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Enerji Kaynağı</p>
                    </div>

                    <div className="bg-red-50 p-3.5 rounded-2xl text-center border border-red-100">
                      <p className="text-[10px] font-black uppercase text-red-600">Sağlıklı Yağ</p>
                      <p className="text-lg font-black font-mono text-zinc-900 mt-1">{results.fat}g</p>
                      <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Hormon Dengesi</p>
                    </div>
                  </div>
                </div>

                {/* Sync Action button */}
                <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex gap-2.5 items-start text-left">
                    <Info className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Bu Kaloriyi Günlük Beslenme Hedefiniz Yapın</h5>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal">
                        Bu değeri onaylayarak STRIVE günlük yemek takibi beslenme sınırınızı bu kaloriyle senkronize edebilirsiniz.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleApplyGoal}
                    disabled={applied}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black italic tracking-tighter transition shrink-0 ${
                      applied 
                        ? "bg-emerald-600 text-white" 
                        : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/15 cursor-pointer"
                    }`}
                  >
                    {applied ? (
                      <span className="flex items-center gap-1"><Check className="w-4 h-4 stroke-[3px]" /> UYGULANDI!</span>
                    ) : "HEDEF OLARAK AYARLA"}
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-12 text-center text-zinc-500 h-[450px] flex flex-col items-center justify-center">
              <Calculator className="w-16 h-16 mb-4 text-zinc-700" />
              <h4 className="font-bold text-zinc-300 text-lg">Hesaplama Hazır Değil</h4>
              <p className="text-xs text-zinc-500 mt-2 max-w-[340px] leading-relaxed mx-auto">
                Lütfen sol taraftaki vücut analiz parametrelerini doldurup <strong>Hesapla</strong> butonuna basın. Raporunuz anında burada oluşturulacaktır.
              </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
