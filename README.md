# Smart Resume Analyzer

A web-based tool that analyzes resumes and provides actionable feedback to help job seekers improve their applications.

## Live Demo

[Try it here](https://perlathebian.github.io/resume-analyzer/)

## Screenshot

 <img src="screenshot.png" width="300" height="500" alt="Resume Analyzer Demo">

## Features

- **PDF Upload & Parsing** - Extracts text from PDF resumes using PDF.js
- **Section Detection** - Identifies key resume sections (Experience, Education, Skills, Summary)
- **Contact Information Extraction** - Finds email and phone numbers using regex patterns
- **Keyword Analysis** - Detects action verbs and technical keywords
- **Smart Scoring System** - Provides scores for completeness, contact info, and language quality
- **Actionable Suggestions** - Gives specific recommendations for improvement
- **Responsive Design** - Works on desktop and mobile devices

## Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Core logic and DOM manipulation
- **PDF.js** - PDF parsing library by Mozilla
- **Regular Expressions** - Pattern matching for contact info and keywords

## Key Concepts Demonstrated

- **Text Processing & Parsing** - Extracting and analyzing unstructured data
- **Pattern Matching (Regex)** - Finding emails, phone numbers, and keywords
- **Algorithm Design** - Scoring system with weighted calculations
- **Data Structures** - Objects and arrays for organizing analysis results
- **Asynchronous Programming** - Handling PDF loading with async/await
- **DOM Manipulation** - Dynamic UI updates based on analysis
- **File Handling** - Reading user-uploaded files in the browser

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in the browser

### Running Locally

1. Clone the repository:

```bash
git clone https://github.com/perlathebian/resume-analyzer.git
```

2. Navigate to the project folder:

```bash
cd resume-analyzer
```

3. Open `index.html` in your browser or use a local server:

```bash
# If you have Python installed:
python -m http.server 8000

# If you have Node.js installed:
npx serve
```

4. Upload a PDF resume and see the analysis!

## How It Works

1. **Upload** - User selects a PDF resume file
2. **Extract** - PDF.js library extracts text from all pages
3. **Analyze** - JavaScript functions process the text:
   - Detect sections using keyword matching
   - Extract contact info using regex patterns
   - Count action verbs and technical keywords
   - Calculate weighted scores
4. **Report** - Display results with visual score indicators and suggestions

## Scoring Algorithm

```
Overall Score = (Completeness × 40%) + (Contact Info × 30%) + (Language Quality × 30%)
```

## Future Enhancements

- [ ] Job description comparison - match resume keywords to job requirements
- [ ] ATS (Applicant Tracking System) compatibility checker
- [ ] Export analysis results as PDF
- [ ] Save and compare multiple resume versions
- [ ] Industry-specific keyword databases
- [ ] Grammar and spelling checker

## What I Learned

This project helped me develop skills in:

- Working with third-party JavaScript libraries
- Text processing and pattern matching with regex
- Designing scoring algorithms
- Creating intuitive user interfaces
- Handling asynchronous operations
- Writing clean, maintainable code

## Author

**Perla Thebian**

- GitHub: [@perlathebian](https://github.com/perlathebian)
- Email: perlathebian02@gmail.com
