export function displayResults(analysis) {
  const resultsDiv = document.getElementById("results");
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
