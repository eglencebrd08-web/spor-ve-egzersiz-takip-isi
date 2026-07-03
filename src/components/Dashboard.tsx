import React, { useState } from "react";
import { DailyStats, LoggedWorkout } from "../types";
import { 
  Flame, 
  Droplets, 
  Utensils, 
  Scale, 
  TrendingUp, 
  Plus, 
  Minus, 
  PlusCircle, 
  Trash2, 
  Award, 
  Activity, 
  Calendar,
  Clock,
  Sparkles,
  Search
} from "lucide-react";
import { FOOD_LIBRARY } from "../data/foods";

interface DashboardProps {
  stats: DailyStats;
  workoutHistory: LoggedWorkout[];
  onUpdateStats: (updater: (prev: DailyStats) => DailyStats) => void;
  onDeleteWorkout: (id: string) => void;
  onNavigateToTab?: (tab: 'dashboard' | 'planner' | 'library' | 'active' | 'calorie') => void;
  profileName?: string;
}

export default function Dashboard({ stats, workoutHistory, onUpdateStats, onDeleteWorkout, onNavigateToTab, profileName = "Mert Karabulut" }: DashboardProps) {
  const [activeChartTab, setActiveChartTab] = useState<'weight' | 'calories' | 'points'>('weight');
  const [newWeight, setNewWeight] = useState<string>("");
  const [foodName, setFoodName] = useState<string>("");
  const [foodCalories, setFoodCalories] = useState<string>("");
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showFoodInput, setShowFoodInput] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState<string>("");
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<string>("Tümü");
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  // States for custom portion logging (Adet / Gramaj)
  const [activeLogFood, setActiveLogFood] = useState<typeof FOOD_LIBRARY[0] | null>(null);
  const [logPortionUnit, setLogPortionUnit] = useState<'piece' | 'g'>('piece');
  const [logPortionAmount, setLogPortionAmount] = useState<string>("1");

  // Stats calculate
  const totalCaloriesBurnedToday = workoutHistory
    .filter(w => {
      const todayStr = new Date().toISOString().split('T')[0];
      const workoutStr = new Date(w.date).toISOString().split('T')[0];
      return todayStr === workoutStr;
    })
    .reduce((sum, w) => sum + w.caloriesBurned, 0);

  const handleAddWater = () => {
    onUpdateStats(prev => ({
      ...prev,
      waterIntakeCups: Math.min(prev.waterGoalCups * 2, prev.waterIntakeCups + 1)
    }));
  };

  const handleRemoveWater = () => {
    onUpdateStats(prev => ({
      ...prev,
      waterIntakeCups: Math.max(0, prev.waterIntakeCups - 1)
    }));
  };

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 0) return;

    const dateInput = document.getElementById("weight-log-date") as HTMLInputElement;
    const selectedDateStr = dateInput?.value || new Date().toISOString().split('T')[0];

    onUpdateStats(prev => {
      const existingIdx = prev.weightHistory.findIndex(h => h.date === selectedDateStr);
      let newHistory = [...prev.weightHistory];
      if (existingIdx >= 0) {
        newHistory[existingIdx] = { date: selectedDateStr, value: weightNum };
      } else {
        newHistory.push({ date: selectedDateStr, value: weightNum });
      }
      // Sort history chronologically
      newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Get the latest log to update currentWeight
      const latestLog = newHistory[newHistory.length - 1];

      return {
        ...prev,
        currentWeight: latestLog ? latestLog.value : weightNum,
        weightHistory: newHistory
      };
    });
    setNewWeight("");
    setShowWeightInput(false);
  };

  const handleLogFood = (e: React.FormEvent) => {
    e.preventDefault();
    const calNum = parseInt(foodCalories);
    if (isNaN(calNum) || calNum <= 0) return;
    const nameStr = foodName.trim() || "Özel Yemek";

    onUpdateStats(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newLoggedFoods = prev.loggedFoods ? [...prev.loggedFoods] : [];
      newLoggedFoods.unshift({
        id: `custom-${Date.now()}`,
        name: nameStr,
        calories: calNum,
        portion: "1 Porsiyon (Özel)",
        date: todayStr
      });
      // Sum all calories of logged foods for absolute correctness
      const totalCal = newLoggedFoods.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
      return {
        ...prev,
        calorieIntake: totalCal,
        loggedFoods: newLoggedFoods
      };
    });

    setAddedNotification(`"${nameStr}" (${calNum} kcal) başarıyla günlüğe eklendi!`);
    setTimeout(() => setAddedNotification(null), 3000);

    setFoodName("");
    setFoodCalories("");
  };

  const handleSelectFoodForLogging = (food: typeof FOOD_LIBRARY[0]) => {
    setActiveLogFood(food);
    // Always default to 'piece' (Adet) for seamless user choice, since we support it for all items now!
    setLogPortionUnit('piece');
    setLogPortionAmount("1");
  };

  const handleConfirmLogLibraryFood = () => {
    if (!activeLogFood) return;
    const food = activeLogFood;
    const amountNum = parseFloat(logPortionAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    let calculatedCalories = 0;
    let portionStr = "";

    if (logPortionUnit === 'piece') {
      const pieceCalories = food.caloriesPerPiece !== undefined 
        ? food.caloriesPerPiece 
        : (food.portionWeightG / 100) * food.caloriesPer100g;
      calculatedCalories = Math.round(amountNum * pieceCalories);
      portionStr = `${amountNum} Adet (${food.portion})`;
    } else {
      calculatedCalories = Math.round((amountNum / 100) * food.caloriesPer100g);
      portionStr = `${amountNum}g (Gramaj)`;
    }

    onUpdateStats(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newLoggedFoods = prev.loggedFoods ? [...prev.loggedFoods] : [];
      newLoggedFoods.unshift({
        id: `${food.id}-${Date.now()}`,
        name: food.name,
        calories: calculatedCalories,
        portion: portionStr,
        date: todayStr
      });
      // Sum all calories of logged foods for absolute correctness
      const totalCal = newLoggedFoods.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
      return {
        ...prev,
        calorieIntake: totalCal,
        loggedFoods: newLoggedFoods
      };
    });

    setAddedNotification(`"${food.name}" (${calculatedCalories} kcal) günlüğe eklendi!`);
    setTimeout(() => setAddedNotification(null), 3000);
    setActiveLogFood(null); // Reset selection
  };

  const handleRemoveLoggedFood = (foodId: string, calories?: number) => {
    onUpdateStats(prev => {
      const newLoggedFoods = (prev.loggedFoods || []).filter(f => f.id !== foodId);
      const totalCal = newLoggedFoods.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
      return {
        ...prev,
        calorieIntake: totalCal,
        loggedFoods: newLoggedFoods
      };
    });
  };

  const handleResetDailyCalorie = () => {
    onUpdateStats(prev => ({
      ...prev,
      calorieIntake: 0,
      loggedFoods: []
    }));
  };

  // Render responsive Custom SVG Chart
  const renderChart = () => {
    if (activeChartTab === 'weight') {
      const data = stats.weightHistory;
      if (data.length < 2) {
        return (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-500 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
            <TrendingUp className="w-10 h-10 mb-2 text-zinc-300" />
            <p className="text-sm font-medium">Kilo grafiği için en az iki günlük kayıt gereklidir.</p>
            <button 
              onClick={() => setShowWeightInput(true)} 
              className="mt-3 text-xs bg-zinc-900 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition"
            >
              Kilo Kaydı Ekle
            </button>
          </div>
        );
      }

      // Find min & max to scale properly
      const weights = data.map(d => d.value);
      const minW = Math.min(...weights) - 1;
      const maxW = Math.max(...weights) + 1;
      const rangeW = maxW - minW || 1;

      const width = 600;
      const height = 240;
      const paddingLeft = 40;
      const paddingRight = 20;
      const paddingTop = 20;
      const paddingBottom = 30;

      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      // Map to coordinates
      const points = data.map((d, index) => {
        const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
        const y = paddingTop + chartHeight - ((d.value - minW) / rangeW) * chartHeight;
        return { x, y, value: d.value, date: d.date };
      });

      const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

      return (
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-64 overflow-visible">
            <defs>
              <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#18181b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#18181b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines & Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yVal = minW + (1 - ratio) * rangeW;
              const yPos = paddingTop + ratio * chartHeight;
              return (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={width - paddingRight} 
                    y2={yPos} 
                    stroke="#e4e4e7" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    className="text-[10px] fill-zinc-500 font-mono"
                  >
                    {yVal.toFixed(1)} kg
                  </text>
                </g>
              );
            })}

            {/* Area Path */}
            <path d={areaPath} fill="url(#weightAreaGrad)" />

            {/* Line Path */}
            <path d={linePath} fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />

            {/* Data Points */}
            {points.map((p, i) => (
              <g key={i} className="group">
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r="4" 
                  className="fill-white stroke-zinc-900 stroke-2 hover:r-6 cursor-pointer transition-all duration-150" 
                />
                {/* Simple tooltip simulation */}
                <text 
                  x={p.x} 
                  y={p.y - 12} 
                  textAnchor="middle" 
                  className="text-[10px] font-bold fill-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                  {p.value} kg
                </text>
                {/* X Axis Date */}
                <text 
                  x={p.x} 
                  y={height - 8} 
                  textAnchor="middle" 
                  className="text-[9px] fill-zinc-400 font-sans"
                >
                  {p.date.substring(5, 10).replace('-', '/')}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );
    } else if (activeChartTab === 'calories') {
      // Calories Burned History Chart
      const today = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      // Aggregate workouts by day
      const dayCalories = last7Days.map(dateStr => {
        const dailyCal = workoutHistory
          .filter(w => new Date(w.date).toISOString().split('T')[0] === dateStr)
          .reduce((sum, w) => sum + w.caloriesBurned, 0);
        return { date: dateStr, value: dailyCal };
      });

      const maxC = Math.max(...dayCalories.map(d => d.value), 300); // at least 300 scale
      const width = 600;
      const height = 240;
      const paddingLeft = 40;
      const paddingRight = 20;
      const paddingTop = 20;
      const paddingBottom = 30;

      const chartWidth = width - paddingLeft - paddingRight;
      const chartHeight = height - paddingTop - paddingBottom;

      const barWidth = (chartWidth / 7) * 0.6;
      const gap = (chartWidth / 7) * 0.4;

      return (
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-64 overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yVal = Math.round((1 - ratio) * maxC);
              const yPos = paddingTop + ratio * chartHeight;
              return (
                <g key={idx}>
                  <line 
                    x1={paddingLeft} 
                    y1={yPos} 
                    x2={width - paddingRight} 
                    y2={yPos} 
                    stroke="#e4e4e7" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={yPos + 4} 
                    textAnchor="end" 
                    className="text-[10px] fill-zinc-500 font-mono"
                  >
                    {yVal} kcal
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {dayCalories.map((d, index) => {
              const xPos = paddingLeft + index * (barWidth + gap) + gap / 2;
              const barHeight = (d.value / maxC) * chartHeight;
              const yPos = paddingTop + chartHeight - barHeight;

              return (
                <g key={index} className="group">
                  <rect 
                    x={xPos} 
                    y={yPos} 
                    width={barWidth} 
                    height={Math.max(barHeight, 2)} 
                    rx="4"
                    className="fill-emerald-500 hover:fill-emerald-600 transition-all duration-150 cursor-pointer"
                  />
                  {/* Calorie Text above bar */}
                  {d.value > 0 && (
                    <text 
                      x={xPos + barWidth / 2} 
                      y={yPos - 6} 
                      textAnchor="middle" 
                      className="text-[10px] font-bold fill-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {d.value} kcal
                    </text>
                  )}
                  {/* X Axis Date */}
                  <text 
                    x={xPos + barWidth / 2} 
                    y={height - 8} 
                    textAnchor="middle" 
                    className="text-[9px] fill-zinc-400 font-sans"
                  >
                    {d.date.substring(5, 10).replace('-', '/')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    } else if (activeChartTab === 'points') {
      const userPoints = stats.totalPoints !== undefined ? stats.totalPoints : 1450;
      
      const leaderboardData = [
        { name: profileName || "Mert Karabulut", points: userPoints, isCurrentUser: true },
        { name: "Canan Şen", points: 2850, isCurrentUser: false },
        { name: "Hakan Çelik", points: 2400, isCurrentUser: false },
        { name: "Buse Yılmaz", points: 1950, isCurrentUser: false },
        { name: "Elif Demir", points: 1600, isCurrentUser: false },
        { name: "Ahmet Yıldız", points: 1050, isCurrentUser: false }
      ];

      // Sort by points descending so the highest is at the top
      leaderboardData.sort((a, b) => b.points - a.points);
      
      const maxPoints = Math.max(...leaderboardData.map(p => p.points), 3000);

      return (
        <div className="space-y-4 py-2 animate-fade-in" id="points-leaderboard">
          <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">SİZİN PUANINIZ</p>
              <p className="text-2xl font-black text-[#D4FF00] font-mono">{userPoints} <span className="text-xs text-zinc-400 font-bold font-sans">Puan</span></p>
            </div>
            <div className="bg-[#D4FF00]/10 px-3 py-1.5 rounded-xl border border-[#D4FF00]/20 text-[11px] font-black text-[#D4FF00] uppercase tracking-wider">
              SIRA: #{leaderboardData.findIndex(p => p.isCurrentUser) + 1}
            </div>
          </div>

          <div className="bg-zinc-950 p-5 rounded-3xl border border-zinc-900 space-y-3.5">
            <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-wider pb-1 border-b border-zinc-900">
              <span>SPORCU İSİM SOYİSİM</span>
              <span>PUAN GRAFİĞİ (LİDERLİK TABLOSU)</span>
            </div>
            <div className="space-y-3">
              {leaderboardData.map((player, idx) => {
                const percentage = (player.points / maxPoints) * 100;
                return (
                  <div key={idx} className={`flex items-center justify-between gap-4 p-2.5 rounded-2xl transition duration-200 ${player.isCurrentUser ? 'bg-[#D4FF00]/5 border border-[#D4FF00]/20 shadow-[0_0_15px_rgba(212,255,0,0.05)]' : 'hover:bg-zinc-900/40 border border-transparent'}`}>
                    {/* Rank & Name */}
                    <div className="flex items-center gap-3 min-w-[140px] sm:min-w-[180px] shrink-0">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className={`text-xs font-black truncate ${player.isCurrentUser ? 'text-[#D4FF00]' : 'text-white'}`}>
                          {player.name}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase font-mono mt-0.5">
                          {player.isCurrentUser ? 'SİZ' : 'SPORCU'}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar Chart */}
                    <div className="flex-1 hidden sm:block">
                      <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-850 p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${player.isCurrentUser ? 'bg-[#D4FF00] shadow-[0_0_10px_rgba(212,255,0,0.5)]' : 'bg-zinc-750'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Points display */}
                    <div className="text-right shrink-0 font-mono">
                      <span className={`text-xs font-black ${player.isCurrentUser ? 'text-[#D4FF00]' : 'text-zinc-300'}`}>
                        {player.points}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-500 font-sans ml-1">pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 italic text-center font-medium mt-1">
            * Antrenmanları tamamladıkça ve su içtikçe puanınız artar, liderlik tablosunda üst sıralara yükselirsiniz!
          </p>
        </div>
      );
    }
  };

  // Helper to normalize Turkish characters for flexible searching
  const normalizeTurkish = (str: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/İ/g, 'i')
      .replace(/I/g, 'i')
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'c')
      .trim();
  };

  // Filter food library based on search and category
  const filteredFoods = FOOD_LIBRARY.filter(food => {
    const normName = normalizeTurkish(food.name);
    const normCategory = normalizeTurkish(food.category);
    const queryTerms = normalizeTurkish(foodSearchQuery).split(/\s+/).filter(Boolean);
    
    // Check if food matches all search terms
    const matchesSearch = queryTerms.every(term => 
      normName.includes(term) || 
      normCategory.includes(term) ||
      (term === "atistirmalik" && normCategory.includes("kuruyemis"))
    );
    
    let matchesCategory = false;
    if (foodSearchQuery.trim() !== "") {
      matchesCategory = true; // global search if search query exists
    } else if (selectedFoodCategory === "Tümü") {
      matchesCategory = true;
    } else if (selectedFoodCategory === "Atıştırmalık") {
      matchesCategory = food.category === "Atıştırmalık & Kuruyemiş";
    } else {
      matchesCategory = food.category === selectedFoodCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  // Water Progress Calculation
  const waterPercent = Math.min(100, (stats.waterIntakeCups / stats.waterGoalCups) * 100);
  const caloriePercent = Math.min(100, (stats.calorieIntake / stats.calorieGoal) * 100);

  return (
    <div className="space-y-6" id="dashboard-tab">
      
      {/* Red & White Calorie Calculator Callout Banner */}
      <div className="bg-red-600 border-2 border-white rounded-3xl p-5 sm:p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white text-red-600 rounded-2xl flex items-center justify-center shadow-lg font-black text-xl font-mono shrink-0">
            kcal
          </div>
          <div>
            <h4 className="font-extrabold text-white text-base tracking-tight uppercase italic flex items-center gap-1.5">
              Günlük Almanız Gereken Kaloriyi Biliyor Musunuz?
            </h4>
            <p className="text-red-100 text-xs mt-1 max-w-xl">
              Mevcut kilonuz, boyunuz, yaşınız ve hedefinize göre günlük kalori limitinizi bilimsel formüllerle hemen hesaplayın ve hedefinizi güncelleyin!
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigateToTab?.('calorie')}
          className="bg-white text-red-600 hover:bg-red-50 font-black italic text-xs px-5 py-3 rounded-xl tracking-tighter transition self-stretch md:self-auto text-center cursor-pointer shrink-0 shadow-md uppercase"
        >
          KALORİ HESAPLAYICIYI AÇ
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Burned Calories */}
        <div id="stat-card-burned" className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">Bugün Yakılan Kalori</p>
              <h4 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">
                {totalCaloriesBurnedToday} <span className="text-xs font-medium text-zinc-400">kcal</span>
              </h4>
              <p className="text-xs text-zinc-500 mt-1">Hedef: {stats.caloriesBurnedGoal} kcal</p>
            </div>
            <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl group-hover:scale-110 transition duration-300">
              <Flame className="w-6 h-6" />
            </div>
          </div>
          {/* Progress Mini bar */}
          <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (totalCaloriesBurnedToday / stats.caloriesBurnedGoal) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Water Consumption */}
        <div id="stat-card-water" className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">Günlük Su Tüketimi</p>
              <h4 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">
                {(stats.waterIntakeCups * 0.25).toFixed(2)} <span className="text-xs font-medium text-zinc-400">Litre</span>
              </h4>
              <p className="text-[11px] text-zinc-500 mt-1">
                {stats.waterIntakeCups * 250} ml / {stats.waterIntakeCups} bardak
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Hedef: {(stats.waterGoalCups * 0.25).toFixed(1)}L ({stats.waterGoalCups} bardak)</p>
            </div>
            <div className="p-2.5 bg-sky-50 text-sky-500 rounded-xl group-hover:scale-110 transition duration-300">
              <Droplets className="w-6 h-6" />
            </div>
          </div>
          {/* Action Row & Diverse size buttons */}
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              {/* 200 ml Row */}
              <div className="flex items-center justify-between bg-zinc-50 hover:bg-zinc-100/60 p-1.5 rounded-xl border border-zinc-100 transition">
                <span className="text-[10px] font-bold text-zinc-600 pl-1">200 ml (Küçük)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: Math.max(0, prev.waterIntakeCups - 0.8) }))}
                    className="w-6 h-6 rounded-lg bg-zinc-200 hover:bg-red-100 hover:text-red-600 text-zinc-750 text-xs font-black flex items-center justify-center transition"
                    title="200 ml Çıkar"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: prev.waterIntakeCups + 0.8 }))}
                    className="w-6 h-6 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-black flex items-center justify-center transition"
                    title="200 ml Ekle"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 250 ml Row */}
              <div className="flex items-center justify-between bg-zinc-50 hover:bg-zinc-100/60 p-1.5 rounded-xl border border-zinc-100 transition">
                <span className="text-[10px] font-bold text-zinc-600 pl-1">250 ml (Bardak)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: Math.max(0, prev.waterIntakeCups - 1) }))}
                    className="w-6 h-6 rounded-lg bg-zinc-200 hover:bg-red-100 hover:text-red-600 text-zinc-750 text-xs font-black flex items-center justify-center transition"
                    title="250 ml Çıkar"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: prev.waterIntakeCups + 1 }))}
                    className="w-6 h-6 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-black flex items-center justify-center transition"
                    title="250 ml Ekle"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 500 ml Row */}
              <div className="flex items-center justify-between bg-zinc-50 hover:bg-zinc-100/60 p-1.5 rounded-xl border border-zinc-100 transition">
                <span className="text-[10px] font-bold text-zinc-600 pl-1">500 ml (Şişe)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: Math.max(0, prev.waterIntakeCups - 2) }))}
                    className="w-6 h-6 rounded-lg bg-zinc-200 hover:bg-red-100 hover:text-red-600 text-zinc-750 text-xs font-black flex items-center justify-center transition"
                    title="500 ml Çıkar"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: prev.waterIntakeCups + 2 }))}
                    className="w-6 h-6 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-black flex items-center justify-center transition"
                    title="500 ml Ekle"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 1.5 Litre Row */}
              <div className="flex items-center justify-between bg-zinc-50 hover:bg-zinc-100/60 p-1.5 rounded-xl border border-zinc-100 transition">
                <span className="text-[10px] font-bold text-zinc-600 pl-1">1.5 Litre (Büyük Şişe)</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: Math.max(0, prev.waterIntakeCups - 6) }))}
                    className="w-6 h-6 rounded-lg bg-zinc-200 hover:bg-red-100 hover:text-red-600 text-zinc-750 text-xs font-black flex items-center justify-center transition"
                    title="1.5 Litre Çıkar"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateStats(prev => ({ ...prev, waterIntakeCups: prev.waterIntakeCups + 6 }))}
                    className="w-6 h-6 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-black flex items-center justify-center transition"
                    title="1.5 Litre Ekle"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center text-[10px] text-zinc-400">
              <span className="font-mono font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                %{waterPercent.toFixed(0)}
              </span>
            </div>
            
            {/* Custom Litre Input */}
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                placeholder="Örn: 0.75 Litre"
                id="custom-water-litre-input"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-[10px] font-bold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("custom-water-litre-input") as HTMLInputElement;
                    const val = parseFloat(el?.value || "");
                    if (!isNaN(val) && val > 0) {
                      onUpdateStats(prev => ({
                        ...prev,
                        waterIntakeCups: Math.max(0, prev.waterIntakeCups - (val / 0.25))
                      }));
                      if (el) el.value = "";
                    }
                  }}
                  className="bg-zinc-200 hover:bg-red-100 hover:text-red-600 text-zinc-700 text-[10px] font-black px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer"
                >
                  Çıkar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("custom-water-litre-input") as HTMLInputElement;
                    const val = parseFloat(el?.value || "");
                    if (!isNaN(val) && val > 0) {
                      onUpdateStats(prev => ({
                        ...prev,
                        waterIntakeCups: prev.waterIntakeCups + (val / 0.25)
                      }));
                      if (el) el.value = "";
                    }
                  }}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calorie Intake */}
        <div id="stat-card-intake" className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">Alınan Kalori (Yemek)</p>
              <h4 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">
                {stats.calorieIntake} <span className="text-xs font-medium text-zinc-400">kcal</span>
              </h4>
              <p className="text-xs text-zinc-500 mt-1">Sınır: {stats.calorieGoal} kcal</p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl group-hover:scale-110 transition duration-300">
              <Utensils className="w-6 h-6" />
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 justify-between">
            <button 
              onClick={() => setShowFoodInput(!showFoodInput)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Yemek Günlüğü
            </button>
            {stats.calorieIntake > 0 && (
              <button 
                onClick={handleResetDailyCalorie}
                className="text-[10px] text-zinc-400 hover:text-red-500 transition"
              >
                Sıfırla
              </button>
            )}
          </div>
        </div>

        {/* Current Weight & Streak */}
        <div id="stat-card-weight" className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-zinc-800"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">Mevcut Kilo & Seri</p>
              <h4 className="text-3xl font-extrabold text-zinc-900 mt-2 font-mono">
                {stats.currentWeight} <span className="text-xs font-medium text-zinc-400">kg</span>
              </h4>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span>{stats.streakDays} Gün Aktif Spor Serisi!</span>
              </p>
              <div className="mt-2 flex items-center gap-1 bg-zinc-950 text-[#D4FF00] font-black px-2.5 py-1 rounded-xl w-max text-[10px] tracking-wider uppercase border border-zinc-800 shadow-sm animate-pulse">
                <Award className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />
                <span>Toplam Puan: {stats.totalPoints !== undefined ? stats.totalPoints : 1450} pts</span>
              </div>
            </div>
            <div className="p-2.5 bg-zinc-100 text-zinc-800 rounded-xl group-hover:scale-110 transition duration-300">
              <Scale className="w-6 h-6" />
            </div>
          </div>
          {/* Action */}
          <div className="flex items-center gap-2 mt-4">
            <button 
              onClick={() => setShowWeightInput(!showWeightInput)}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Kilo Güncelle
            </button>
          </div>
        </div>
      </div>

      {/* Floating logging forms */}
      {showWeightInput && (
        <form onSubmit={handleLogWeight} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 shadow-inner flex flex-wrap gap-3 items-end animate-fade-in">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 block">Yeni Kilo (kg)</label>
            <input 
              type="number" 
              step="0.1"
              required
              placeholder="Örn: 74.5"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-sm text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 w-32"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-600 block">Tarih</label>
            <input 
              type="date" 
              required
              id="weight-log-date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-sm text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <button 
            type="submit" 
            className="bg-zinc-950 text-white font-medium px-4 py-1.5 rounded-lg text-sm hover:bg-zinc-800 transition cursor-pointer"
          >
            Kaydet
          </button>
          <button 
            type="button" 
            onClick={() => setShowWeightInput(false)}
            className="text-xs text-zinc-500 hover:text-zinc-800 py-2 cursor-pointer"
          >
            Vazgeç
          </button>
        </form>
      )}

      {showFoodInput && (
        <div className="bg-emerald-50/40 rounded-3xl border-2 border-emerald-500/30 p-6 shadow-xl space-y-6 animate-fade-in">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-emerald-500/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 tracking-tight text-lg">Yemek ve Besin Günlüğü</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Yüzlerce besin arasından seçim yapın veya özel bir yemek ekleyin.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowFoodInput(false)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200/80 px-3 py-1.5 rounded-xl transition"
            >
              Kapat
            </button>
          </div>

          {/* Quick Notification Toast */}
          {addedNotification && (
            <div className="bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-emerald-500 animate-pulse flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0"></div>
              <span>{addedNotification}</span>
            </div>
          )}

          {/* Search & Categories */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Muz, Tavuk, Çorba, Elma, Kahve vb. besinleri arayın..."
                value={foodSearchQuery}
                onChange={(e) => setFoodSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-zinc-800 shadow-sm"
              />
            </div>

            {/* Category selection */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
              {["Tümü", "Meyveler", "Sebzeler", "Ana Yemekler", "İçecekler", "Kahvaltılık", "Çorbalar", "Atıştırmalık", "Tatlı & Unlu Mamuller"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFoodCategory(cat)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-full shrink-0 transition-all duration-150 ${
                    selectedFoodCategory === cat 
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/10" 
                      : "bg-white text-zinc-600 border border-zinc-200/80 hover:bg-zinc-50"
                  }`}
                >
                  {cat === "Atıştırmalık" ? "Atıştırmalık (Markalı)" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left: Food library selection grid (span-2) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Besin Listesi ({filteredFoods.length} sonuç)
                </span>
                {foodSearchQuery && (
                  <button 
                    type="button"
                    onClick={() => setFoodSearchQuery("")}
                    className="text-[11px] text-zinc-400 hover:text-zinc-600"
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>

              <div className="bg-white rounded-3xl border border-zinc-200/60 overflow-hidden shadow-sm">
                <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-100 p-2 space-y-1">
                  {filteredFoods.length === 0 ? (
                    <div className="py-12 text-center text-zinc-400 text-xs">
                      Aradığınız kriterlere uygun besin bulunamadı. Aşağıdan veya yan taraftan özel yemek ekleyebilirsiniz!
                    </div>
                  ) : (
                    filteredFoods.map((food) => {
                      const isActive = activeLogFood?.id === food.id;
                      
                      // Calculate live preview calories based on current unit and amount
                      let previewCalories = 0;
                      const amountNum = parseFloat(logPortionAmount) || 0;
                      if (isActive) {
                        if (logPortionUnit === 'piece') {
                          const pieceCalories = food.caloriesPerPiece !== undefined 
                            ? food.caloriesPerPiece 
                            : (food.portionWeightG / 100) * food.caloriesPer100g;
                          previewCalories = Math.round(amountNum * pieceCalories);
                        } else {
                          previewCalories = Math.round((amountNum / 100) * food.caloriesPer100g);
                        }
                      }

                      if (isActive) {
                        return (
                          <div 
                            key={food.id} 
                            className="p-4 rounded-2xl bg-emerald-50/40 border-2 border-emerald-500/30 shadow-sm transition-all duration-200 space-y-3"
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-zinc-950 text-sm">{food.name}</span>
                                  <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                                    Seçildi
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-500 font-semibold">
                                  {food.portion} (100g = {food.caloriesPer100g} kcal)
                                </p>
                              </div>
                              <span className="text-sm sm:text-base font-black text-emerald-600 font-mono shrink-0">
                                {previewCalories} kcal
                              </span>
                            </div>

                            {/* Control Controls inside expansion */}
                            <div className="pt-3 border-t border-emerald-500/15 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                              {/* Piece vs Gram selection */}
                              <div className="flex bg-white p-1 rounded-xl border border-zinc-200/80 shrink-0 self-start">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLogPortionUnit('piece');
                                    setLogPortionAmount("1");
                                  }}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                                    logPortionUnit === 'piece' 
                                      ? "bg-emerald-600 text-white shadow-sm" 
                                      : "text-zinc-600 hover:text-zinc-950"
                                  }`}
                                >
                                  Adet / Porsiyon
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLogPortionUnit('g');
                                    setLogPortionAmount(String(food.portionWeightG));
                                  }}
                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-150 ${
                                    logPortionUnit === 'g' 
                                      ? "bg-emerald-600 text-white shadow-sm" 
                                      : "text-zinc-600 hover:text-zinc-950"
                                  }`}
                                >
                                  Gramaj (g)
                                </button>
                              </div>

                              {/* Amount Input with +/- controls */}
                              <div className="flex items-center gap-2 self-start">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = parseFloat(logPortionAmount) || 0;
                                    const step = logPortionUnit === 'piece' ? 0.5 : 50;
                                    setLogPortionAmount(String(Math.max(logPortionUnit === 'piece' ? 0.1 : 5, current - step)));
                                  }}
                                  className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 font-black hover:bg-zinc-50 active:scale-95 transition"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  step={logPortionUnit === 'piece' ? "0.1" : "5"}
                                  min="0.1"
                                  value={logPortionAmount}
                                  onChange={(e) => setLogPortionAmount(e.target.value)}
                                  className="w-20 bg-white border border-zinc-200 rounded-lg px-2 py-1.5 text-center text-xs font-bold text-zinc-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = parseFloat(logPortionAmount) || 0;
                                    const step = logPortionUnit === 'piece' ? 0.5 : 50;
                                    setLogPortionAmount(String(current + step));
                                  }}
                                  className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 font-black hover:bg-zinc-50 active:scale-95 transition"
                                >
                                  +
                                </button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 shrink-0 justify-end mt-2 sm:mt-0">
                                <button
                                  type="button"
                                  onClick={() => setActiveLogFood(null)}
                                  className="px-3 py-1.5 bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition hover:bg-zinc-300"
                                >
                                  Vazgeç
                                </button>
                                <button
                                  type="button"
                                  onClick={handleConfirmLogLibraryFood}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition"
                                >
                                  Günlüğe Ekle
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div 
                          key={food.id}
                          onClick={() => handleSelectFoodForLogging(food)}
                          className="flex justify-between items-center p-3 rounded-2xl hover:bg-zinc-50 transition duration-150 cursor-pointer"
                        >
                          <div className="space-y-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-zinc-900 text-sm truncate">{food.name}</span>
                              <span className="text-[9px] bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                                {food.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <span className="font-semibold font-mono text-[11px]">{food.portion}</span>
                              {food.carbs !== undefined && (
                                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                                  • Karb: {food.carbs}g | Prt: {food.protein}g | Yağ: {food.fat}g
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-bold text-zinc-500 font-mono bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                              {food.caloriesPerPiece !== undefined ? `${food.caloriesPerPiece} kcal / Adet` : `${food.caloriesPer100g} kcal / 100g`}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectFoodForLogging(food);
                              }}
                              className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all duration-150 flex items-center justify-center font-bold text-base shadow-sm active:scale-95 cursor-pointer"
                              title="Miktar Belirle"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Log custom food OR display today's foods logged */}
            <div className="space-y-5">
              
              {/* Custom Food Form */}
              <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Özel Yemek / İçecek Ekle:
                </h4>
                <form onSubmit={handleLogFood} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 block">Yemek/İçecek Adı</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Örn: Ev Yapımı Çorba, Özel Shake"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 block">Kalori Miktarı (kcal)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Örn: 240"
                      value={foodCalories}
                      onChange={(e) => setFoodCalories(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-800 font-mono"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-sm active:scale-95 cursor-pointer"
                  >
                    Özel Yemek Kaydet
                  </button>
                </form>
              </div>

              {/* Today's logged foods list */}
              <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-200 shadow-inner space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-zinc-500" />
                    Bugün Tüketilenler:
                  </h4>
                  {(stats.loggedFoods || []).length > 0 && (
                    <button 
                      type="button"
                      onClick={handleResetDailyCalorie}
                      className="text-[10px] text-red-500 hover:underline font-bold"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>

                <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                  {(!stats.loggedFoods || stats.loggedFoods.length === 0) ? (
                    <div className="py-8 text-center text-zinc-400 text-[11px] italic">
                      Bugün henüz besin kaydedilmedi. Yukarıdan hızlıca ekleyebilirsiniz!
                    </div>
                  ) : (
                    stats.loggedFoods.map((loggedItem) => (
                      <div 
                        key={loggedItem.id}
                        className="bg-white p-2.5 rounded-xl border border-zinc-100 flex justify-between items-center gap-2 group shadow-sm animate-fade-in"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-zinc-800 truncate">{loggedItem.name}</p>
                          <p className="text-[10px] text-zinc-400 font-mono truncate">{loggedItem.portion}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-bold text-zinc-700 font-mono">{loggedItem.calories} kcal</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLoggedFood(loggedItem.id, loggedItem.calories)}
                            className="text-zinc-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-zinc-200/80 pt-2.5 flex justify-between items-center text-xs font-bold text-zinc-600 px-1">
                  <span>Toplam Alınan:</span>
                  <span className="text-emerald-600 font-black font-mono text-sm">{stats.calorieIntake} / {stats.calorieGoal} kcal</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Main Grid: Chart & Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart (Left & Center) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-800" />
              <h3 className="font-bold text-zinc-950">Gelişim Analizi</h3>
            </div>
            {/* Chart toggle tabs */}
            <div className="flex bg-zinc-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveChartTab('weight')}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition ${activeChartTab === 'weight' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Kilo Grafiği
              </button>
              <button 
                onClick={() => setActiveChartTab('calories')}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition ${activeChartTab === 'calories' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Yakılan Kaloriler
              </button>
              <button 
                onClick={() => setActiveChartTab('points')}
                className={`text-xs font-semibold px-3 py-1 rounded-md transition ${activeChartTab === 'points' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                Puan Grafiği
              </button>
            </div>
          </div>

          {/* Graph Display */}
          {renderChart()}

          {/* Managed Weight Logs */}
          {stats.weightHistory.length > 0 && (
            <div className="pt-3 border-t border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Kilo Kayıt Geçmişi:</span>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pb-1">
                {stats.weightHistory.map((h, i) => (
                  <div key={i} className="bg-zinc-50 border border-zinc-200/60 rounded-xl pl-2.5 pr-1.5 py-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-700 animate-fade-in">
                    <span className="font-mono font-bold text-zinc-800">{h.value} kg</span>
                    <span className="text-zinc-300 font-normal">|</span>
                    <span className="text-[10px] text-zinc-500">{new Date(h.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateStats(prev => {
                          const newHistory = prev.weightHistory.filter(item => item.date !== h.date);
                          const latestLog = newHistory[newHistory.length - 1];
                          return {
                            ...prev,
                            weightHistory: newHistory,
                            currentWeight: latestLog ? latestLog.value : 0
                          };
                        });
                      }}
                      className="text-zinc-400 hover:text-red-500 p-0.5 rounded transition cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-zinc-400 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-100 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <span>
              <strong>İpucu:</strong> Spor yapma sürekliliğiniz, metabolizma hızınızı artırarak kilo dengenizi korumanıza yardımcı olur. Yapay zeka programlarınızı düzenli uygulayarak serinizi koruyun!
            </span>
          </div>
        </div>

        {/* Workout History Logs (Right Side) */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-4 max-h-[400px] lg:max-h-none overflow-y-auto">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-zinc-800" />
              <h3 className="font-bold text-zinc-950">Son Aktivite Günlüğü</h3>
            </div>
            <span className="text-xs bg-zinc-100 text-zinc-600 font-bold px-2 py-0.5 rounded-full">
              {workoutHistory.length} Kayıt
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {workoutHistory.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-zinc-400 text-center py-6">
                <Clock className="w-8 h-8 mb-2 text-zinc-300" />
                <p className="text-xs font-semibold">Henüz hiç egzersiz yapmadınız.</p>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">
                  "Aktif Antrenman" sekmesine giderek bir egzersiz başlatıp tamamlayabilirsiniz!
                </p>
              </div>
            ) : (
              [...workoutHistory]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((w) => (
                  <div 
                    key={w.id} 
                    className="border border-zinc-100 rounded-xl p-3.5 hover:bg-zinc-50/50 transition relative group"
                  >
                    <button 
                      onClick={() => onDeleteWorkout(w.id)}
                      className="absolute top-3 right-3 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1 rounded-lg hover:bg-zinc-100"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg text-white mt-0.5 ${
                        w.type === 'Cardio' ? 'bg-blue-500' :
                        w.type === 'Strength' ? 'bg-red-500' :
                        w.type === 'Yoga' ? 'bg-indigo-500' :
                        w.type === 'HIIT' ? 'bg-amber-500' : 'bg-zinc-500'
                      }`}>
                        {w.type === 'Cardio' ? <Flame className="w-3.5 h-3.5" /> : 
                         w.type === 'Strength' ? <Activity className="w-3.5 h-3.5" /> :
                         w.type === 'Yoga' ? <TrendingUp className="w-3.5 h-3.5" /> : 
                         <Flame className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">{w.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500 font-mono">
                          <span>{w.durationMinutes} dk</span>
                          <span>•</span>
                          <span className="text-orange-600 font-semibold">{w.caloriesBurned} kcal</span>
                          <span>•</span>
                          <span>{new Date(w.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        {w.notes && (
                          <p className="text-[11px] text-zinc-400 italic mt-1.5 line-clamp-2">
                            "{w.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
