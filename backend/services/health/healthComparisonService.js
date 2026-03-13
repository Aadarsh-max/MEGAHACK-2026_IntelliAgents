import normalRanges from "../../utils/normalRanges.js";

const healthComparisonService = (parameters) => {
  const analyzedParameters = parameters.map((param) => {
    const range = normalRanges[param.name];

    if (!range) {
      return { ...param, status: "unknown" };
    }

    let status = "normal";

    if (param.value < range.min) status = "low";
    if (param.value > range.max) status = "high";

    return {
      ...param,
      normalRange: `${range.min}-${range.max}`,
      status,
    };
  });

  return analyzedParameters;
};

export default healthComparisonService;
