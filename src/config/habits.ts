export interface Habit {
  key: string;
  label: string;
  icon: string;
}

export const HABITS: Habit[] = [
  { key: "10_min_self_control", label: "10 minutos sin teléfono", icon: "📵" },
  { key: "expose_to_sun", label: "Exponerse al sol", icon: "☀️" },
  { key: "make_bed", label: "Hacer la cama", icon: "🛏️" },
  { key: "2_mins_of_breath", label: "2 minutos de respiración", icon: "🌬" },
  { key: "hydration", label: "Beber agua", icon: "💧" },
  { key: "movement", label: "5 minutos de movimiento", icon: "🏃" },
  { key: "intention", label: "Escribe tu intención diaria", icon: "📝" },
  { key: "avoid_negative_stimulants", label: "Evitar estimulantes negativos", icon: "🚫" },
  { key: "gratitude", label: "Práctica de gratitud", icon: "🙏" },
  { key: "positive_action", label: "Acción positiva", icon: "✅" },
  { key: "nutritional_supplements", label: "Electrolitos y Creatina", icon: "💊" },
];

export const getHabitByKey = (key: string): Habit | undefined => {
  return HABITS.find((habit) => habit.key === key);
};
