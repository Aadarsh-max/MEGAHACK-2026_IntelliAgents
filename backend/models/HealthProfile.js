import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    age: Number,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    height: Number,

    weight: Number,

    bloodGroup: String,

    allergies: {
      type: [String],
      default: [],
    },

    existingConditions: {
      type: [String],
      default: [],
    },

    lifestyle: {
      smoking: {
        type: Boolean,
        default: false,
      },
      alcohol: {
        type: Boolean,
        default: false,
      },
      exerciseLevel: {
        type: String,
        enum: ["low", "moderate", "high"],
      },
    },
  },
  { timestamps: true },
);

const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);

export default HealthProfile;
