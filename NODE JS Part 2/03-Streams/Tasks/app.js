import { Transform } from "stream";
import fs, { write } from 'fs';

// Task 1 -- > 

// const readStream = fs.createReadStream('sample.txt')

// readStream.on("data", (chunk) => {
//     console.log(chunk);
// })

// readStream.on("end", () => {
//     console.log("Finished Reading");
// })


// Task 2 -- >

// const readStream = fs.createReadStream('sample.txt')

// readStream.on("data", (chunk) => {
//     console.log("Chunk: ", chunk);
//     console.log("Is Buffer: ", Buffer.isBuffer(chunk));
//     console.log("Chunk size: ", chunk.length);

// })

// readStream.on("end", () => {
//     console.log("Finished Reading");
// })



// Task 3 -- >

// const writeStream = fs.createWriteStream('output.txt');

// writeStream.write("Hello Node.js\n")
// writeStream.write("Streams are interesting\n")
// writeStream.write("I am learning backend development")

// writeStream.end(() => {
//     console.log("Writing completed");

// })


// Task 4 -- > 

// const readStream = fs.createReadStream('sample.txt')
// const writeStream = fs.createWriteStream('output.txt')

// readStream.on("data", (chunk) => {
//     writeStream.write(chunk)
// })


// readStream.on("end", () => {
//     writeStream.end();
//     console.log("Data copied to output.txt file");

// })


// Task 5 --> 

// const readStream = fs.createReadStream('sample.txt')
// const writeStream = fs.createWriteStream('output.txt')

// readStream.pipe(writeStream);

// writeStream.on("finish", () => {
//     console.log("Data copied to output.txt");
// })


// Task 6 -- > 

// const readStream = fs.createReadStream('sample.txt')
// const writeStream = fs.createWriteStream('output.txt')

// const transformToUpperCase = new Transform({
//     transform(chunk, encoding, callback) {
//         const data = chunk.toString().toLocaleUpperCase()

//         callback(null, data);
//     }
// })

// readStream.pipe(transformToUpperCase).pipe(writeStream)

// writeStream.on("finish", () => {
//     console.log("data converted to uppercase");
// })



// Task 7 -- >

const readStream = fs.createReadStream('sample.txt')
const writeStream = fs.createWriteStream('output.txt')

const addPrefixToChunks = new Transform({
    transform(chunk, encoding, callback) {
        let data = chunk.toString().split('\n');

        let result = ""

        for (let i = 0; i < data.length; i++) {
            result += "[DATA] " + data[i] + '\n';
        }

        callback(null, result)
    }
})


readStream.pipe(addPrefixToChunks).pipe(writeStream)

writeStream.on("finish", () => {
    console.log("Data transformed successfully");

})