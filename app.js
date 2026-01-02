// Wait for PDF.js library to load
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Get the file input element
const fileInput = document.getElementById("resumeUpload");
const resultsDiv = document.getElementById("results");

// Listen for file selection
fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file && file.type === "application/pdf") {
    console.log("PDF selected:", file.name);
    extractTextFromPDF(file);
  } else {
    alert("Please select a valid PDF file");
  }
});

// Function to extract text from PDF
async function extractTextFromPDF(file) {
  try {
    // Read the file as array buffer (convert to binary data)
    const arrayBuffer = await file.arrayBuffer();

    // Load the PDF
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    console.log("PDF loaded, pages:", pdf.numPages);

    let fullText = "";

    // Loop through each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Extract text from page
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    // Analyze extracted text
    analyzeResume(fullText);
  } catch (error) {
    console.error("Error extracting text:", error);
    alert("Error reading PDF. Please try another file.");
  }
}

// ===== ANALYSIS FUNCTIONS =====

// Main analysis function
function analyzeResume(text) {
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
function detectSections(text) {
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
function extractContactInfo(text) {
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
function analyzeKeywords(text) {
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

// Calculate scores
function calculateScores(text, sections, contactInfo, keywords) {
  // completeness score (/100)
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const completenessScore = (sectionCount / 4) * 100;

  // contact info scire
  let contactScore = 0;
  if (contactInfo.email) contactScore += 50;
  if (contactInfo.phone) contactScore += 50;

  // language quality score (based on action verbs)
  const verbScore = Math.min((keywords.actionVerbCount / 5) * 100, 100);

  // Overall score (weighted average)
  const overallScore = Math.round(
    completenessScore * 0.4 + contactScore * 0.3 + verbScore * 0.3
  );

  return {
    overall: overallScore,
    completeness: Math.round(completenessScore),
    contact: contactScore,
    language: Math.round(verbScore),
  };
}

// Genrate suggestions
function generateSuggestions(sections, contactInfo, keywords, text) {
  const suggestions = [];

  // Check for missing sections
  if (!sections.experience) {
    suggestions.push('Add an "Experience" or "Work History" section');
  }
  if (!sections.education) {
    suggestions.push('Add an "Education" section');
  }
  if (!sections.skills) {
    suggestions.push('Add a "Skills" section to highlight your expertise');
  }
  if (!sections.summary) {
    suggestions.push('Consider adding a "Summary" or "Objective" at the top');
  }

  // check conatct info
  if (!contactInfo.email) {
    suggestions.push("Include your email address");
  }
  if (!contactInfo.phone) {
    suggestions.push("Include your phone number");
  }
  // Check language quality
  if (keywords.actionVerbCount < 5) {
    suggestions.push(
      "Use more action verbs (managed, developed, led, etc.) to describe your achievements"
    );
  }

  // Check for quantifiable achievements
  const hasNumbers = /\d+%|\d+\+|\$\d+/.test(text);
  if (!hasNumbers) {
    suggestions.push(
      'Add quantifiable achievements (e.g., "increased sales by 25%")'
    );
  }

  // Check length
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    suggestions.push(
      "Your resume seems short. Consider adding more detail about your experience"
    );
  }

  if (suggestions.length === 0) {
    suggestions.push("Great job! Your resume has all the key elements");
  }

  return suggestions;
}

// Extract keywords from text (removes stop words from job description)
function extractKeywords(text) {
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
function compareToJobDescription(resumeText, jobDescription) {
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

// Display results
function displayResults(analysis) {
  resultsDiv.innerHTML = `
    <div class="score-section">
            <h2>Overall Score</h2>
            <div class="score-circle">
                <div class="score-number">${analysis.scores.overall}</div>
                <div class="score-label">/100</div>
            </div>
        </div>

        <div class="breakdown-section">
            <h3>Score Breakdown</h3>
            <div class="score-bar">
                <div class="score-bar-label">Completeness</div>
                <div class="score-bar-bg">
                    <div class="score-bar-fill" style="width: ${
                      analysis.scores.completeness
                    }%"></div>
                </div>
                <div class="score-bar-value">${
                  analysis.scores.completeness
                }/100</div>
            </div>
            <div class="score-bar">
                <div class="score-bar-label">Contact Info</div>
                <div class="score-bar-bg">
                    <div class="score-bar-fill" style="width: ${
                      analysis.scores.contact
                    }%"></div>
                </div>
                <div class="score-bar-value">${
                  analysis.scores.contact
                }/100</div>
            </div>
            <div class="score-bar">
                <div class="score-bar-label">Language Quality</div>
                <div class="score-bar-bg">
                    <div class="score-bar-fill" style="width: ${
                      analysis.scores.language
                    }%"></div>
                </div>
                <div class="score-bar-value">${
                  analysis.scores.language
                }/100</div>
            </div>
        </div>

        <div class="sections-found">
            <h3>Sections Found</h3>
            <div class="section-tags">
                ${Object.entries(analysis.sections)
                  .map(
                    ([name, found]) => `
                    <span class="tag ${found ? "tag-success" : "tag-missing"}">
                        ${found ? "✓" : "✗"} ${
                      name.charAt(0).toUpperCase() + name.slice(1)
                    }
                    </span>
                `
                  )
                  .join("")}
            </div>
        </div>

        <div class="contact-info">
            <h3>Contact Information</h3>
            <p>${
              analysis.contactInfo.email
                ? "✓ Email: " + analysis.contactInfo.email
                : "✗ No email found"
            }</p>
            <p>${
              analysis.contactInfo.phone
                ? "✓ Phone: " + analysis.contactInfo.phone
                : "✗ No phone found"
            }</p>
        </div>

        <div class="keywords-section">
            <h3>Keywords Found</h3>
            <p><strong>Action Verbs (${
              analysis.keywords.actionVerbCount
            }):</strong> ${
    analysis.keywords.actionVerbs.join(", ") || "None found"
  }</p>
            <p><strong>Technical Skills (${
              analysis.keywords.techKeywordCount
            }):</strong> ${
    analysis.keywords.techKeywords.join(", ") || "None found"
  }</p>
        </div>

        ${
          analysis.jobComparison
            ? `
        <div class="job-match-section">
            <h3>🎯 Job Match Analysis</h3>
            <div class="match-score ${
              analysis.jobComparison.matchPercentage >= 70
                ? "match-good"
                : analysis.jobComparison.matchPercentage >= 50
                ? "match-moderate"
                : "match-poor"
            }">
                <div class="match-percentage">${
                  analysis.jobComparison.matchPercentage
                }%</div>
                <div class="match-label">Match</div>
            </div>
            
            <div class="match-details">
                <div class="matched-keywords">
                    <h4>✅ Found in Resume (${
                      analysis.jobComparison.matchedKeywords.length
                    })</h4>
                    <div class="keyword-tags">
                        ${analysis.jobComparison.matchedKeywords
                          .slice(0, 15)
                          .map(
                            (kw) =>
                              `<span class="keyword-tag keyword-matched">${kw}</span>`
                          )
                          .join("")}
                        ${
                          analysis.jobComparison.matchedKeywords.length > 15
                            ? `<span class="keyword-tag">+${
                                analysis.jobComparison.matchedKeywords.length -
                                15
                              } more</span>`
                            : ""
                        }
                    </div>
                </div>
                
                ${
                  analysis.jobComparison.missingKeywords.length > 0
                    ? `
                <div class="missing-keywords">
                    <h4>❌ Missing from Resume (${
                      analysis.jobComparison.missingKeywords.length
                    })</h4>
                    <div class="keyword-tags">
                        ${analysis.jobComparison.missingKeywords
                          .slice(0, 15)
                          .map(
                            (kw) =>
                              `<span class="keyword-tag keyword-missing">${kw}</span>`
                          )
                          .join("")}
                        ${
                          analysis.jobComparison.missingKeywords.length > 15
                            ? `<span class="keyword-tag">+${
                                analysis.jobComparison.missingKeywords.length -
                                15
                              } more</span>`
                            : ""
                        }
                    </div>
                </div>
                `
                    : ""
                }
            </div>
        </div>
        `
            : ""
        }

        <div class="suggestions-section">
            <h3>💡 Suggestions for Improvement</h3>
            <ul>
                ${analysis.suggestions
                  .map((suggestion) => `<li>${suggestion}</li>`)
                  .join("")}
                ${
                  analysis.jobComparison &&
                  analysis.jobComparison.missingKeywords.length > 0
                    ? `
                    <li>Consider adding these job-related keywords: ${analysis.jobComparison.missingKeywords
                      .slice(0, 5)
                      .join(", ")}</li>
                `
                    : ""
                }
            </ul>
        </div>
    `;
  resultsDiv.style.display = "block";
  resultsDiv.scrollIntoView({ behavior: "smooth" });
}
