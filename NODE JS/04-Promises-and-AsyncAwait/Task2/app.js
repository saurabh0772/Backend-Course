const { resolve } = require('dns');
const fs = require('fs')
const path = require('path')

const user = fs.promises.readFile(path.join("data", "user.txt"), "utf8");

user
.then((result) => {
    console.log(result);
    return fs.promises.readFile(path.join("data", "skills.txt"), "utf8");
})
.then((result) => {
    console.log(result);
    return fs.promises.readFile(path.join("data", "projects.txt"), "utf8");
})
.then((result) => {
    console.log(result);
    console.log("All files processed");
})
.catch((err) => {
    console.log(err);
})


