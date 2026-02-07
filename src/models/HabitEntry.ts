import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabitEntry extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: string; // "YYYY-MM-DD" format
  habits: Map<string, boolean>;
  /** Text input values per habit key (for habits with inputCount 1 or 3) */
  habitInputs: Map<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

const HabitEntrySchema = new Schema<IHabitEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    habits: {
      type: Map,
      of: Boolean,
      default: {},
    },
    habitInputs: {
      type: Map,
      of: [String],
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one entry per user per day
HabitEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const HabitEntry: Model<IHabitEntry> =
  mongoose.models.HabitEntry ||
  mongoose.model<IHabitEntry>("HabitEntry", HabitEntrySchema);

export default HabitEntry;
