# Smart Resume Analyzer

Client-side web app that analyzes PDF resumes and provides explainable feedback similar to ATS-style screening.

**Live Demo:** https://perlathebian.github.io/resume-analyzer/

<p align="center">
  <img src="images/job_analysis_match.png" width="300" height="600" alt="Job Match Analysis Screenshot" />
</p>

---

## What It Does

- Extracts text from multi-page PDF resumes
- Detects key resume sections (Experience, Education, Skills, Summary)
- Extracts contact information (email + international phone formats)
- Scores resume quality using clear heuristics
- Optionally compares resumes to job descriptions
- Runs fully in-browser (no backend, no uploads)

---

## Why This Project Exists

Most resume tools are opaque or over-engineered.  
This project focuses on **clarity, explainability, and practical heuristics** under real ATS-like constraints.

---

## Architecture

```
UI (DOM)
  ↓
Controller (app.js)
  ↓
Core Analysis Modules
```

Logic is separated by responsibility to keep the system readable and debuggable.

---

## Scoring Model (Explainable by Design)

```
Overall Score =
  Completeness (40%)
+ Contact Info (30%)
+ Language Quality (30%)
```

**Rationale**

- Missing sections are a common ATS rejection cause
- Contact information is critical and binary
- Action verbs signal impact and seniority

No machine learning is used — scoring is deterministic and explainable.

---

## Key Technical Decisions

### PDF Parsing

- Uses **PDF.js (Mozilla)** for consistent text extraction across formats

### Section Detection

- Keyword-based heading detection
- Favors transparency and speed over perfect accuracy

### Contact Extraction

- Regex-based email and phone parsing
- Phone detection supports international formats with digit-count validation

### Job Matching (Optional)

- Set-based keyword intersection
- Stop-word filtering to reduce noise
- MVP approach without black-box NLP

---

## Tech Stack

- JavaScript (ES6+) — async/await, Sets
- HTML / CSS
- PDF.js
- Browser APIs (FileReader, DOM)

No backend. No data persistence.

---

## Limitations

- Keyword matching is context-blind
- Creative section headings may not be detected
- PDF text order depends on document structure

These are documented tradeoffs.

---

## Future Improvements

- [ ] NLP-based section detection
- [ ] TF-IDF or embeddings for smarter job matching
- [ ] Python-based analysis engine
- [ ] Exportable reports
- [ ] TypeScript and tests

---

## Run Locally

```bash
git clone https://github.com/perlathebian/resume-analyzer
cd resume-analyzer

# If you have Python installed:
python -m http.server 8000

# If you have Node.js installed:
npx serve
```

Open http://localhost:8000 in your browser.
