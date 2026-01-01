// Wait for PDF.js library to load
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Get the file input element
const fileInput = document.getElementById("resumeUpload");
const resultsDiv = document.getElementById("results");
const extractedTextDiv = document.getElementById("extractedText");

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

    // Display the extracted text
    displayResults(fullText);
  } catch (error) {
    console.error("Error extracting text:", error);
    alert("Error reading PDF. Please try another file.");
  }
}

// Function to display results
function displayResults(text) {
  extractedTextDiv.textContent = text;
  resultsDiv.style.display = "block";

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: "smooth" });
}
