const healthScoreService = (parameters) => {
  if (!parameters || parameters.length === 0) return 0;

  let score = 100;

  parameters.forEach((param) => {
    if (param.status === "low" || param.status === "high") {
      score -= 10;
    }
  });

  if (score < 0) score = 0;

  return score;
};

export default healthScoreService;
