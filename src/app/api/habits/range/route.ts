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
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!start || !dateRe.test(start) || !end || !dateRe.test(end)) {
      return NextResponse.json(
        { error: "Query params start and end (YYYY-MM-DD) required" },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json({ error: "start must be <= end" }, { status: 400 });
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const entries = await HabitEntry.find({
      userId,
      date: { $gte: start, $lte: end },
    }).lean();

    const entriesMap: Record<string, Record<string, boolean>> = {};
    for (const e of entries) {
      entriesMap[e.date] = habitsToObject((e as { habits?: Map<string, boolean> | Record<string, boolean> }).habits);
    }

    return NextResponse.json({ entries: entriesMap });
  } catch (error) {
    console.error("GET /api/habits/range error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
