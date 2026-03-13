import mongoose from "mongoose";

const parameterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: Number,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ["low", "normal", "high"],
    },
  },
  { _id: false },
);

const medicalReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportFile: {
      type: String,
      required: true,
    },

    reportDate: {
      type: Date,
      default: Date.now,
    },

    parameters: {
      type: [parameterSchema],
      default: [],
    },

    healthScore: {
      type: Number,
    },

    aiSummary: {
      type: String,
    },

    risks: {
      type: [String],
      default: [],
    },

    processed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema);

export default MedicalReport;
