const path = require('path')
const fs = require('fs')

const filePath = path.join("data", "sample.txt");

console.log("Path of sample file :", filePath);

console.log("File Name : ", path.basename(filePath))
console.log("File Extension : ", path.extname(filePath))
console.log("Directory Name : ", path.dirname(filePath))
console.log("Absolute Path : ", path.resolve(filePath))


// checking that the file exists or not
if(fs.existsSync(filePath)){
    console.log("File exists: Yes")
    const stats = fs.statSync(filePath);
    console.log("File size : ", stats.size, " bytes")
}


// reading the file content 

const readingData = fs.readFileSync(filePath, 'utf-8');
console.log("Content : ", readingData);