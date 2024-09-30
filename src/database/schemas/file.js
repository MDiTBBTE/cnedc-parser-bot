import mongoose from "mongoose";

export const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    bin: { type: Buffer, required: false },
    telegramId: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

export const File = mongoose.model("Files", fileSchema);
