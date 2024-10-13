const express = require('express');
const multer = require('multer');
const pdf = require('html-pdf');
const bodyParser = require('body-parser');
const moment = require('moment');
const teachersAvailability = require('./teachersAvailability');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let con = 0;
let subject = 0;
let teacher = 0;

const GOOGLE_API_KEY = "AIzaSyDT44DwhkyBDfA8pjggMguusRaMEyp0VhM"; // Use environment variable if deploying
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY); // Initialize Generative AI with the API key

// Configure EJS as the view engine and set views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to extract JSON array from text
function extractJsonArray(text) {
  const jsonArrayPattern = /\[(.*?)\]/s;
  const match = text.match(jsonArrayPattern);
  if (match && match[0]) {
    return match[0]; // Return the JSON array portion
  } else {
    throw new Error('No JSON array found in the text.');
  }
}

// Route for the home page
app.get('/', (req, res) => {
  res.render('index'); // Render the home page
});

// Route for the teacher form
app.get('/teacher', (req, res) => {
  res.render('teacher'); // Render the teacher form
});

// Route for the subject form
app.get('/subject', (req, res) => {
  res.render('subject'); // Render the subject form
});

// Route for handling teacher image upload and processing
app.post('/teacher', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path; // Get uploaded image path
  try {
    teacher = await run(imagePath); // Run image processing
    console.log(teacher);
    res.redirect("/teacher-availability"); // Redirect to teacher availability page
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Failed to process image.');
  }
});

// Route for handling subject image upload and processing
app.post('/subject', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path; // Get uploaded image path
  try {
    subject = await run(imagePath); // Run image processing
    console.log(subject);
    res.render("generate_time"); // Render timetable generation page
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Failed to process image.');
  }
});

// Route to handle form submission for quiz generation
app.post('/submit-quiz-form', (req, res) => {
  const quizPerDay = 5;
  const startDate = req.body.startDate;
  const startTime = req.body.startTime;
  const endTime = "14:00"; // Fixed end time

  // Log form data
  console.log('Form Data:', {
    quizPerDay,
    startDate,
    startTime,
    endTime
  });

  // Generate timetable based on provided form data
  const timetable = generateTimetable(startDate, teacher, subject, quizPerDay);
  const time_range = ["09:AM", "11:AM", "1:PM", "3:PM", "5:PM"];
  
  res.render('help', { timetable, time_range }); // Render timetable with time slots
});

// Sample route for generating and rendering a timetable
app.get('/help', (req, res) => {
  const startDate = '2024-09-02'; // Example start date
  const teachers = ['Mr. Smith', 'Ms. Johnson', 'Mrs. Brown', 'Mr. Lee', 'Ms. Davis'];
  const subjects = ['Math', 'Science', 'English', 'History', 'Geography'];
  const subjectCapacity = 2;
  const time_range = ["09:00", "12:00", "15:00", "17:00"];

  const timetable = generateTimetable(startDate, teachers, subjects, subjectCapacity);
  res.render('help', { timetable, time_range });
});

// Function to generate the quiz timetable
function generateTimetable(startDate, teachers, subjects, subjectCapacity) {
  let timetable = {};
  let currentDate = moment(startDate);
  let teacherIndex = 0;
  let subjectAssignments = {};

  subjects.forEach(subject => subjectAssignments[subject] = 0); // Initialize assignment counts for each subject

  const totalSubjects = subjects.length;
  const totalDays = Math.ceil(totalSubjects / subjectCapacity);

  for (let day = 1; day <= totalDays; day++) {
    while (currentDate.day() === 6 || currentDate.day() === 0) {
      currentDate.add(1, 'days'); // Skip weekends
    }

    let dayName = currentDate.format('dddd');
    let date = currentDate.format('MMMM Do YYYY');
    let key = `Day ${day} - ${dayName}, ${date}`;
    timetable[key] = [];

    for (let slot = 0; slot < 5; slot++) {
      let assigned = false;

      // Check if all subjects are full
      const allSubjectsFull = subjects.every(subj => subjectAssignments[subj] >= subjectCapacity);
      if (allSubjectsFull) break;

      // Try to assign teacher to subject
      while (!assigned) {
        const subject = subjects[teacherIndex % subjects.length];

        if (subjectAssignments[subject] < subjectCapacity) {
          timetable[key].push({
            teacher: teachers[teacherIndex],
            subject: subject
          });

          subjectAssignments[subject]++;
          assigned = true;
        }

        teacherIndex = (teacherIndex + 1) % teachers.length;

        if (teacherIndex === 0) break; // If no more teachers, stop assignment
      }
    }

    currentDate.add(1, 'days'); // Move to the next day
  }

  return timetable;
}

// Function to divide time range into intervals (morning, afternoon, evening)
function divideTimeRange(startTime, endTime) {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  const totalTime = end - start;
  const interval = totalTime / 3;
  const timeRanges = [];

  for (let i = 0; i < 3; i++) {
    const partStart = new Date(start.getTime() + i * interval);
    const partEnd = new Date(start.getTime() + (i + 1) * interval);

    const partStartTime = partStart.toTimeString().slice(0, 5);
    const partEndTime = partEnd.toTimeString().slice(0, 5);

    timeRanges.push(`${partStartTime} to ${partEndTime}`);
  }

  return timeRanges;
}

// Route for teacher availability form
app.get('/teacher-availability', (req, res) => {
  res.render('availability'); // Render teacher availability form
});

// Handle availability form submission
app.post('/teacher-availability', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;
  console.log(teachersAvailability);
  res.redirect("/subject");
});

// Function to process the image and generate names from the model
async function run(imagePath) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    "give me names of all in array in json",
    {
      inlineData: {
        data: Buffer.from(fs.readFileSync(imagePath)).toString("base64"),
        mimeType: 'image/jpeg',
      },
    },
  ]);

  const responseText = await result.response.text();
  const jsonArrayText = extractJsonArray(responseText);
  const namesArray = JSON.parse(jsonArrayText);

  fs.unlinkSync(imagePath); // Clean up the uploaded image after use
  return namesArray;
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
