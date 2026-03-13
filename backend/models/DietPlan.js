import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    breakfast: [String],
    lunch: [String],
    dinner: [String],
    snacks: [String],
  },
  { _id: false },
);

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalReport",
    },

    healthConditions: {
      type: [String],
      default: [],
    },

    recommendedFoods: {
      type: [String],
      default: [],
    },

    foodsToAvoid: {
      type: [String],
      default: [],
    },

    mealPlan: mealSchema,

    notes: {
      type: String,
    },

    generatedByAI: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

export default DietPlan;
