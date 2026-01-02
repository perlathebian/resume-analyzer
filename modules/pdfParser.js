// Wait for PDF.js library to load
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Function to extract text from PDF
export async function extractTextFromPDF(file) {
  try {
    // Read the file as array buffer (converts to binary data)
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

    return fullText;
  } catch (error) {
    console.error("Error extracting text:", error);
    alert("Error reading PDF. Please try another file.");
    return "";
  }
}
