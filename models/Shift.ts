import mongoose, { Schema, models } from 'mongoose'

const shiftSchema = new Schema(
    {
      placeId: { type: String, required: true },
      date: { type: String, required: true }, // формат: "YYYY-MM-DD"
      coworkers: [
        {
          coworkerId: { type: Schema.Types.ObjectId, ref: "Coworker", required: true },
          role: { type: String, enum: ["master", "senior"], required: true },
        },
      ],
      coalman: {
        coworkerId: { type: Schema.Types.ObjectId, ref: "Coworker" },
        fixedSalary: { type: Number, default: 70 },
      },
      sales: {
        type: Map,
        of: Number,
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );
  
  shiftSchema.index({ placeId: 1, date: 1 }, { unique: true });
  
  const Shift = models.Shift || mongoose.model("Shift", shiftSchema);
  export default Shift;
  