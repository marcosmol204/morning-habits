import HomeContent from "@/components/HomeContent";
import { getHabitsForDate } from "./getHabitsForDate";

export default async function Home() {
  const today = new Date().toISOString().split("T")[0];
  const initialHabits = await getHabitsForDate(today);

  return (
    <HomeContent
      today={today}
      initialHabits={initialHabits.habits ?? {}}
      initialHabitInputs={initialHabits.habitInputs ?? {}}
    />
  );
}
