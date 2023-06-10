const fs = require("fs");
const path = require("path");

function processFile(file) {
  console.log(`Processing file: ${file}`);
}

const directory = "../back-end";
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }
  files.forEach((file) => {
    const filePath = path.join(directory, file);

    
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error retrieving file stats for ${filePath}:`, err);
        return;
      }

      if (stats.isFile()) {
       
        processFile(filePath);
      }
    });
  });
});
