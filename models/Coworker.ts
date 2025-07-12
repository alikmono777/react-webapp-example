import mongoose, { Schema, models } from "mongoose";

const coworkerSchema = new Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["master", "senior"],
    required: true,
  },
});

const Coworker = models.Coworker || mongoose.model("Coworker", coworkerSchema);

export default Coworker;
