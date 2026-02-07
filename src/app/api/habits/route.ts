import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";
import mongoose from "mongoose";

function habitsToObject(habits: Map<string, boolean> | Record<string, boolean> | undefined): Record<string, boolean> {
  if (!habits) return {};
  if (habits instanceof Map) return Object.fromEntries(habits);
  if (typeof habits === "object" && habits !== null) return habits as Record<string, boolean>;
  return {};
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Valid date (YYYY-MM-DD) required" }, { status: 400 });
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const entry = await HabitEntry.findOne({ userId, date });
    const habits = habitsToObject(entry?.habits);

    return NextResponse.json({ habits });
  } catch (error) {
    console.error("GET /api/habits error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, habitKey, completed } = body;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || typeof habitKey !== "string" || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Body must include date (YYYY-MM-DD), habitKey (string), and completed (boolean)" },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const entry = await HabitEntry.findOneAndUpdate(
      { userId, date },
      { $set: { [`habits.${habitKey}`]: completed } },
      { new: true, upsert: true }
    );

    const habits = habitsToObject(entry?.habits);
    return NextResponse.json({ habits });
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
