const fs = require('fs');
const cheerio = require('cheerio');

// Check if the HTML file exists
const filePath = 'facultyOfLaw.html';
if (!fs.existsSync(filePath)) {
    console.error("The HTML file does not exist.");
    process.exit(1);
}

// Read the HTML file
let html;
try {
    html = fs.readFileSync(filePath, 'utf-8');
    console.log("HTML file read successfully.");
} catch (error) {
    console.error("Error reading the HTML file:", error);
    process.exit(1);
}

// Log the length of the HTML content to ensure it's not empty
console.log(`HTML content length: ${html.length}`);

// Load the HTML into Cheerio
const $ = cheerio.load(html);

// Extract all <a> elements and their text content and href attribute
const courses = [];

$('a').each((index, element) => {
    let courseName = $(element).text().trim();
    let courseLink = $(element).attr('href');

    // Remove unwanted characters (\n, \t, etc.)
    courseName = courseName.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();

    if (courseName && courseLink) {
        // Create an object for each course
        courses.push({
            courseName: courseName,
            courseLink: courseLink
        });
    }
});

// Remove duplicates by converting the array to a Set and back to an array
const uniqueCourses = [...new Set(courses.map(course => JSON.stringify(course)))].map(item => JSON.parse(item));

// Check if any course data was found
if (uniqueCourses.length === 0) {
    console.log("No <a> elements with valid course data found.");
} else {
    // Convert the array of course objects to JSON
    const jsonOutput = JSON.stringify(uniqueCourses, null, 4);

    // Write the JSON output to a file
    try {
        fs.writeFileSync('facultyOfLaw.json', jsonOutput, 'utf-8');
        console.log("JSON file created successfully: facultyOfLaw.json");
    } catch (error) {
        console.error("Error writing the JSON file:", error);
    }
}
