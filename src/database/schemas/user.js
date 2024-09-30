import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    telegramUserName: { type: String, required: false },
    telegramId: { type: Number, unique: true, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    parses: { type: Number, required: false },
    checks: { type: Number, required: false },
    lang: { type: String, required: false },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "Files" }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
