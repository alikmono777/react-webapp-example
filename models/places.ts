import mongoose, { Schema, models } from 'mongoose'

const hookahSchema = new Schema({
  price: Number,
  salaryWChef: Number,
  salary: Number,
}, { _id: false })

const placeSchema = new Schema({
  name: { type: String, required: true },
  uniqueId: { type: String, required: true },
  hookahs: {
    type: Map,
    of: hookahSchema
  },
  salaryFix: Number,
})

const Place = models.Place || mongoose.model('Place', placeSchema)

export default Place