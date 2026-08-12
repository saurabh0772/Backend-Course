🟢 Task 1 — File Information Tool

Create a Node.js program that gives information about a file.

First, create this structure:

project/
├── app.js
└── data/
    └── sample.txt

Put some text inside sample.txt.

Your program should:

Use the path module to get:
File name
File extension
Directory name
Absolute path
Use the fs module to:
Check whether the file exists
Read the file content
Get the file size
Expected output
File Information
----------------
Name: sample.txt
Extension: .txt
Directory: data
Absolute Path: /home/.../project/data/sample.txt

File Exists: Yes
File Size: 125 bytes

Content:
Hello, I am learning Node.js!
Rules
path module is mandatory.
fs module is mandatory.
You can use readFile() or readFileSync().
Do not use any external packages.
🟡 Task 2 — Simple File Organizer

Create a folder called downloads:

downloads/
├── song.mp3
├── photo.jpg
├── notes.txt
├── video.mp4
├── resume.pdf
└── image.png

Create a Node.js program that automatically organizes these files according to their extensions.

After running your program, the folder should look like:

downloads/
├── mp3/
│   └── song.mp3
├── jpg/
│   └── photo.jpg
├── txt/
│   └── notes.txt
├── mp4/
│   └── video.mp4
├── pdf/
│   └── resume.pdf
└── png/
    └── image.png
Requirements

Your program should:

Read all files inside downloads.
Find the extension of each file.
Create a folder for that extension if it doesn't exist.
Move the file into the correct folder.
Modules to practice

path

Get file extensions.
Create file and folder paths.

fs

Read directory contents.
Create directories.
Move/rename files.
Useful methods

You may want to use:

fs.readdir()
fs.mkdir()
fs.rename()

path.extname()
path.join()

Try to figure out the complete logic yourself.

🔴 Task 3 — CLI Notes Manager

Create a small command-line Notes Manager using Node.js.

The notes should be stored in a file called:

notes.json
Commands

Your program should support:

node app.js add "Learn Node.js"

This should add a new note.

Then:

node app.js list

Should display all notes.

And:

node app.js delete 1

Should delete the note with ID 1.

Example

After running:

node app.js add "Learn Node.js"
node app.js add "Practice fs module"

notes.json could look like:

[
  {
    "id": 1,
    "text": "Learn Node.js"
  },
  {
    "id": 2,
    "text": "Practice fs module"
  }
]

Running:

node app.js list

could show:

Your Notes
----------
1. Learn Node.js
2. Practice fs module

Running:

node app.js delete 1

should remove the first note.

After that:

node app.js list

should show:

Your Notes
----------
2. Practice fs module
Concepts you should practice
process.argv
fs.readFileSync()
fs.writeFileSync()
fs.existsSync()
path.join()
JSON.parse()
JSON.stringify()