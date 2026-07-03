/**
 * Types representing the sports application data structure
 */

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
  targetMuscle: string;
  estimatedCaloriesBurned: number;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  programName: string;
  summary: string;
  days: WorkoutDay[];
  nutritionTips: string[];
}

export interface LoggedWorkout {
  id: string;
  date: string; // ISO date string
  name: string; // e.g. "Cardiyo ve Karın", "Göğüs & Kol"
  durationMinutes: number;
  caloriesBurned: number;
  type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
  notes?: string;
}

export interface DailyStats {
  caloriesBurnedGoal: number;
  waterGoalCups: number;
  waterIntakeCups: number;
  calorieIntake: number; // Food eaten
  calorieGoal: number;
  weightHistory: { date: string; value: number }[];
  currentWeight: number;
  streakDays: number;
  totalPoints?: number;
  loggedFoods?: { id: string; name: string; calories: number; portion: string; date: string }[];
}
