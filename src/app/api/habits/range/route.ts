import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";
import { HABITS } from "@/config/habits";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { error: "Start and end date parameters are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const entries = await HabitEntry.find({
      userId: session.user.id,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Transform entries into a map keyed by date
    const habitsByDate: Record<string, Record<string, boolean>> = {};

    entries.forEach((entry) => {
      const habits: Record<string, boolean> = {};
      HABITS.forEach((habit) => {
        habits[habit.key] = entry.habits?.get(habit.key) || false;
      });
      habitsByDate[entry.date] = habits;
    });

    return NextResponse.json({
      start,
      end,
      entries: habitsByDate,
      totalHabits: HABITS.length,
    });
  } catch (error) {
    console.error("Get habits range error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
