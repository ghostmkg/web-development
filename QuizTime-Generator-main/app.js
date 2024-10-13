const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Express app
const app = express();

// Initialize Google Gemini API with your API key
const GOOGLE_API_KEY = "AIzaSyDT44DwhkyBDfA8pjggMguusRaMEyp0VhM"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Set up multer for handling file uploads (PDFs)
const upload = multer({ dest: 'uploads/' });
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upload PDF</title>
    </head>
    <body>
      <h2>Upload a PDF</h2>
      <form ref='uploadForm' 
        id='uploadForm' 
        action='/upload-pdf' 
        method='post' 
        encType="multipart/form-data">
          <label for="pdf">Choose a PDF file:</label>
          <input type="file" name="pdf" accept="application/pdf" required />
          <br><br>
          <input type='submit' value='Upload PDF!' />
      </form>
    </body>
    </html>
  `);
});
// POST route to handle PDF upload and extraction
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  const pdfPath = req.file.path; // Access the uploaded PDF file

  try {
    // Read the uploaded PDF file
    const pdfData = fs.readFileSync(pdfPath);

    // Use pdf-parse to extract text from the PDF
    const pdfText = await pdfParse(pdfData);

    // Pass the extracted text to the Gemini API for further processing with the prompt
    const geminiResponse = await sendToGemini(pdfText.text);

    // Respond with the Gemini API output
    res.json({
      message: 'PDF processed successfully',
      geminiOutput: geminiResponse,
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Failed to process PDF.');
  } finally {
    // Clean up the uploaded file after use
    fs.unlinkSync(pdfPath);
  }
});

// Function to send the extracted text to the Google Gemini API
async function sendToGemini(pdfText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Define the prompt that includes detailed extraction instructions
  const prompt = `
    I have a PDF document containing a student's exam results. The document has the following sections:

    1. Front Page: 
       - Student Enrollment: A number in the format "0801CSXXXXXXX".
       - Table: A table with 5 rows representing questions and 6 columns (a, b, c, d, e, Total).
       - Grand Total: The total marks obtained.

    2. Other Pages:
       - Page Number: A number printed in the upper right corner of each page.
       - Marks: A number representing the total marks for that page, also printed in the upper right corner.

    Please extract the following information from the PDF:

    - Student Enrollment
    - Page-wise Marks: An array of objects, each containing "page_no" and "marks".
    - Total Marks: The total marks obtained.
    - Table Marks: An array of objects, each containing "question_no" (1 to 5), and the marks for columns "a", "b", "c", "d", "e", and "total".

    Example output in JSON format:
    {
      "enrollment": "0801CS191041",
      "page_wise_marks": [
        {
          "page_no": 2,
          "marks": 6
        },
        {
          "page_no": 3,
          "marks": 70
        }
      ],
      "total_marks": 22,
      "table_marks": [
        {
          "question_no": 1,
          "a": 0,
          "b": 2,
          "c": 2,
          "d": null,
          "e": 1,
          "total": 5
        }
      ]
    }
      dont give extra information only output as  Example output in JSON format: extract all from given pdf dont give explanation
  `;

  // Send the prompt and the extracted PDF text to the Gemini API
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: Buffer.from(pdfText).toString("base64"),
        mimeType: 'text/plain',
      },
    },
  ]);

  const responseText = await result.response.text();
console.log(responseText);
  // Here you can process the response from the Gemini API
  return responseText;
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
