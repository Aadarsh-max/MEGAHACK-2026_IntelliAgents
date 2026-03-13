const healthTrendService = (reports, parameterName) => {
  if (!reports || reports.length === 0) return [];

  const trend = reports.map((report) => {
    const param = report.parameters.find(
      (p) => p.name.toLowerCase() === parameterName.toLowerCase(),
    );

    return {
      date: report.reportDate,
      value: param ? param.value : null,
    };
  });

  return trend;
};

export default healthTrendService;
