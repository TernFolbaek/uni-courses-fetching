const fs = require('fs');
const cheerio = require('cheerio');

// Check if the HTML file exists
const filePath = 'dtuhtml.html';
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

// Extract all <a> elements and their text content
const aElements = [];

$('a').each((index, element) => {
    let text = $(element).text().trim();

    // Remove unwanted characters (\n, \t, etc.)
    text = text.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();

    console.log(`Sanitized <a> tag: "${text}"`);  // Log the sanitized text
    if (text) {
        aElements.push(text);
    }
});

// Check if any <a> elements were found
if (aElements.length === 0) {
    console.log("No <a> elements found or no text extracted.");
} else {
    // Convert the array of text content to JSON
    const jsonOutput = JSON.stringify(aElements, null, 4);

    // Write the JSON output to a file
    try {
        fs.writeFileSync('output.json', jsonOutput, 'utf-8');
        console.log("JSON file created successfully: output.json");
    } catch (error) {
        console.error("Error writing the JSON file:", error);
    }
}
