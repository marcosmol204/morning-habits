import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

function habitsToObject(habits: Map<string, boolean> | Record<string, boolean> | undefined): Record<string, boolean> {
  if (!habits) return {};
  if (habits instanceof Map) return Object.fromEntries(habits);
  if (typeof habits === "object" && habits !== null) return habits as Record<string, boolean>;
  return {};
}

function habitInputsToObject(
  habitInputs: Map<string, string[]> | Record<string, string[]> | undefined
): Record<string, string[]> {
  if (!habitInputs) return {};
  if (habitInputs instanceof Map) return Object.fromEntries(habitInputs);
  if (typeof habitInputs === "object" && habitInputs !== null) {
    const out: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(habitInputs)) {
      out[k] = Array.isArray(v) ? v : [];
    }
    return out;
  }
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
    const habitInputs = habitInputsToObject(entry?.habitInputs);

    return NextResponse.json({ habits, habitInputs });
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
    const { date, habitKey, completed, inputs } = body;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || typeof habitKey !== "string") {
      return NextResponse.json(
        { error: "Body must include date (YYYY-MM-DD) and habitKey (string)" },
        { status: 400 }
      );
    }
    const hasCompleted = typeof completed === "boolean";
    const hasInputs = Array.isArray(inputs) && inputs.every((v: unknown) => typeof v === "string");
    if (!hasCompleted && !hasInputs) {
      return NextResponse.json(
        { error: "Body must include either completed (boolean) or inputs (string[])" },
        { status: 400 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const update: Record<string, unknown> = {};
    if (hasCompleted) update[`habits.${habitKey}`] = completed;
    if (hasInputs) {
      update[`habitInputs.${habitKey}`] = inputs as string[];
      if (!hasCompleted) update[`habits.${habitKey}`] = true;
    }

    const entry = await HabitEntry.findOneAndUpdate(
      { userId, date },
      { $set: update },
      { new: true, upsert: true }
    );

    const habits = habitsToObject(entry?.habits);
    const habitInputs = habitInputsToObject(entry?.habitInputs);
    return NextResponse.json({ habits, habitInputs });
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
