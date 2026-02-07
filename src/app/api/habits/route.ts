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
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const entry = await HabitEntry.findOne({
      userId: session.user.id,
      date,
    });

    // Return entry habits or default all to false
    const habits: Record<string, boolean> = {};
    HABITS.forEach((habit) => {
      habits[habit.key] = entry?.habits?.get(habit.key) || false;
    });

    return NextResponse.json({ date, habits });
  } catch (error) {
    console.error("Get habits error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, habitKey, completed } = await request.json();

    if (!date || !habitKey || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Date, habitKey, and completed are required" },
        { status: 400 }
      );
    }

    // Validate habit key
    const validHabit = HABITS.find((h) => h.key === habitKey);
    if (!validHabit) {
      return NextResponse.json({ error: "Invalid habit key" }, { status: 400 });
    }

    await dbConnect();

    const entry = await HabitEntry.findOneAndUpdate(
      { userId: session.user.id, date },
      { $set: { [`habits.${habitKey}`]: completed } },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      date,
      habitKey,
      completed,
      entry: {
        id: entry._id,
        habits: Object.fromEntries(entry.habits),
      },
    });
  } catch (error) {
    console.error("Update habit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
