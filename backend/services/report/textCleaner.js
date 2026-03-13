const textCleaner = (text) => {
  if (!text) return "";

  let cleanedText = text;

  cleanedText = cleanedText.replace(/\r\n/g, " ");
  cleanedText = cleanedText.replace(/\n/g, " ");
  cleanedText = cleanedText.replace(/\t/g, " ");
  cleanedText = cleanedText.replace(/\s+/g, " ");

  cleanedText = cleanedText.trim();

  return cleanedText;
};

export default textCleaner;