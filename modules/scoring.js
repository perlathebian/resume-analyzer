// Calculate scores
export function calculateScores(text, sections, contactInfo, keywords) {
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
export function generateSuggestions(sections, contactInfo, keywords, text) {
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
