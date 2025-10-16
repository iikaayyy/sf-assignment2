const fs = require("fs");

function readJSONFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data); // Parse the JSON and return it
  } catch (err) {
    console.error("Error reading JSON file:", err);
    throw err; // Rethrow the error for further handling if needed
  }
}

function writeJSONFile(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Pretty print with 2 spaces for readability
    fs.writeFileSync(filePath, jsonData, "utf-8");
  } catch (err) {
    console.error("Error writing JSON file:", err);
    throw err; // Rethrow the error for further handling if needed
  }
}

module.exports = { readJSONFile, writeJSONFile };
