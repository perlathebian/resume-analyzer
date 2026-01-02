import { calculateScores, generateSuggestions } from "./scoring.js";
import { compareToJobDescription } from "./jobComparison.js";
import { displayResults } from "./uiRenderer.js";

// Main analysis function
export function analyzeResume(text) {
  console.log("Starting analysis...");

  const sections = detectSections(text);
  const contactInfo = extractContactInfo(text);
  const keywords = analyzeKeywords(text);
  const scores = calculateScores(text, sections, contactInfo, keywords);
  const suggestions = generateSuggestions(
    sections,
    contactInfo,
    keywords,
    text
  );

  // Get job description and compare if provided
  const jobDescriptionText = document.getElementById("jobDescription").value;
  const jobComparison = compareToJobDescription(text, jobDescriptionText);

  displayResults({
    text: text,
    sections: sections,
    contactInfo: contactInfo,
    keywords: keywords,
    scores: scores,
    suggestions: suggestions,
    jobComparison: jobComparison,
  });
}

// Detect resume sections
export function detectSections(text) {
  const sectionKeywords = {
    experience: [
      "experience",
      "work history",
      "employment",
      "work experience",
      "professional experience",
    ],
    education: ["education", "academic", "qualifications", "degree"],
    skills: ["skills", "technical skills", "competencies", "expertise"],
    summary: ["summary", "objective", "profile", "about me"],
  };

  const foundSections = {};
  const lowerText = text.toLowerCase();

  for (let [section, keywords] of Object.entries(sectionKeywords)) {
    foundSections[section] = keywords.some((keyword) =>
      lowerText.includes(keyword)
    );
  }

  return foundSections;
}

// Extract contact info using regex
export function extractContactInfo(text) {
  // email pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];

  // Phone pattern (matches various formats)
  const phoneRegex =
    /(\+?\d{1,4})?[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{0,4}/g;
  const phoneMatches = text.match(phoneRegex) || [];
  // Filter to keep only valid-looking phone numbers (at least 7 digits)
  const phones = phoneMatches.filter((phone) => {
    const digitCount = phone.replace(/\D/g, "").length;
    return digitCount >= 7 && digitCount <= 15;
  });
  return {
    email: emails[0] || null,
    phone: phones[0] || null,
  };
}

// Analyze keywords and action verbs
export function analyzeKeywords(text) {
  const lowerText = text.toLowerCase();

  // Action verbs that show impact
  const actionVerbs = [
    "managed",
    "led",
    "developed",
    "created",
    "implemented",
    "designed",
    "built",
    "launched",
    "improved",
    "increased",
    "reduced",
    "achieved",
    "delivered",
    "organized",
    "coordinated",
    "executed",
    "established",
  ];

  // technical keywords (some examples - of course could be expanded)
  const techKeywords = [
    "javascript",
    "python",
    "java",
    "react",
    "node",
    "sql",
    "git",
    "api",
    "database",
    "html",
    "css",
    "agile",
    "testing",
    "oop",
  ];

  const foundActionVerbs = actionVerbs.filter((verb) =>
    lowerText.includes(verb)
  );
  const foundTechKeywords = techKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  );

  return {
    actionVerbs: foundActionVerbs,
    actionVerbCount: foundActionVerbs.length,
    techKeywords: foundTechKeywords,
    techKeywordCount: foundTechKeywords.length,
  };
}
