// Extract keywords from text (removes stop words from job description)
export function extractKeywords(text) {
  // Common words to ignore
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "should",
    "could",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "up",
    "down",
    "out",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
  ]);

  // Split text into words, clean and filter
  const words = text
    .toLowerCase()
    .replace(/[^\w\s+#.-]/g, " ") // Keep +, #, ., - for tech terms
    .split(/\s+/)
    .filter((word) => {
      return (
        word.length > 2 && // At least 3 characters
        !stopWords.has(word) && // Not a stop word
        !/^\d+$/.test(word)
      ); // Not just numbers
    });

  // Remove duplicates using Set
  return [...new Set(words)];
}

// Compare resume to job description
export function compareToJobDescription(resumeText, jobDescription) {
  if (!jobDescription || jobDescription.trim().length === 0) {
    return null; // No comparison if no job description
  }

  // Extract keywords from both
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  // Find matches and missing keywords
  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeKeywords.includes(keyword)
  );

  const missingKeywords = jobKeywords.filter(
    (keyword) => !resumeKeywords.includes(keyword)
  );

  // Calculate match percentage
  const matchPercentage =
    jobKeywords.length > 0
      ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
      : 0;

  return {
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    totalJobKeywords: jobKeywords.length,
  };
}
