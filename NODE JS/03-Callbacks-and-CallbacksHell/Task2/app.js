const fs = require('fs')
const path = require('path')

fs.readFile(path.join("data", "user.txt"), 'utf8', (err, data) => {
    if(err){
        console.log("Error in User file", err);
        return;
    }

    console.log("User: \n", data, "\n");

    fs.readFile(path.join("data", "skills.txt"), 'utf8', (err, data) => {
        if(err){
            console.log("Error in Skill File ", err);
            return;
        }

        console.log("Skills: \n", data, "\n");

        fs.readFile(path.join("data", "projects.txt"), 'utf8', (err, data) => {
            if(err) {
                console.log("Error in Projects File", err);
                return;
            }

            console.log("Project: \n", data);
        })
    })
})
