const fs = require('fs')

const path = 'sample.txt'



// if we dont pass encoding method, then it gives data as buffer, and if use encoding , then it give data directly as string

fs.readFile(path, "utf8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Raw Buffer:");
    console.log(data);

    console.log("\nDecoded Text:");
    console.log(data.toString());
});
