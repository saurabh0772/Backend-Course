const path = require('path')
const fs = require('fs')


const filePath = path.join("downloads")
// console.log(filePath)

const data = fs.readdirSync(filePath)
// console.log(data);

data.forEach(ele => {
    // console.log(ele)

    // console.log(path.extname(ele))
    if(path.extname(ele) === ".png"){
        console.log("Png File : ", ele);
        if(!fs.existsSync(path.join(filePath,"Images"))){
            // console.log("path not exists")
            fs.mkdirSync(path.join(filePath, "Images"))
            console.log("Images folder create successfully.")
        }

        fs.renameSync(path.join(filePath, ele), path.join(filePath, "Images", ele))
        
    }
    if(path.extname(ele) === ".mp3"){
        console.log("Mp3 File : ", ele);
        if(!fs.existsSync(path.join(filePath,"Music"))){
            // console.log("path not exists")
            fs.mkdirSync(path.join(filePath, "Music"))
            console.log("Music folder created successfully.")
        }

        fs.renameSync(path.join(filePath, ele), path.join(filePath, "Music", ele));
    }
    if(path.extname(ele) === ".pdf"){
        console.log("Pdf File : ", ele);
        if(!fs.existsSync(path.join(filePath,"Document"))){
            // console.log("path not exists")
            fs.mkdirSync(path.join(filePath, "Document"))
            console.log("Document folder create successfully.")
        }

        fs.renameSync(path.join(filePath, ele), path.join(filePath, "Document", ele));
    }
    if(path.extname(ele) === ".txt"){
        console.log("Txt File : ", ele);
        if(!fs.existsSync(path.join(filePath,"Text"))){
            // console.log("path not exists")
            fs.mkdirSync(path.join(filePath, "Text"))
            console.log("Text folder create successfully.")
        }

        fs.renameSync(path.join(filePath, ele), path.join(filePath, "Text", ele));
    }
    if(path.extname(ele) === ".mp4"){
        console.log("Mp4 File : ", ele);
        if(!fs.existsSync(path.join(filePath,"Videos"))){
            // console.log("path not exists")
            fs.mkdirSync(path.join(filePath, "Videos"))
            console.log("Videos folder create successfully.")
        }

        fs.renameSync(path.join(filePath, ele), path.join(filePath, "Videos", ele));
    }

});