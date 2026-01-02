import { extractTextFromPDF } from "./modules/pdfParser.js";
import { analyzeResume } from "./modules/resumeAnalysis.js";

// Get the file input element
const fileInput = document.getElementById("resumeUpload");

// Listen for file selection
fileInput.addEventListener("change", async function (event) {
  const file = event.target.files[0];

  if (file && file.type === "application/pdf") {
    console.log("PDF selected:", file.name);
    const text = await extractTextFromPDF(file);
    if (text) analyzeResume(text);
  } else {
    alert("Please select a valid PDF file");
  }
});
