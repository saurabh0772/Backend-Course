const EventEmitter = require("events");

const emitter = new EventEmitter();

const user = {
    id: 1,
    name: "Saurabh"
}

function sendWelcomeEmail(){
    console.log("Sending welcome email...")
    console.log("Welcome email sent.\n")
}

function createAuditLog(){
    console.log("Creating audit log...")
    console.log("Audit log created.\n")
}

function updateAnalytics(){
    console.log("Updating analytics...")
    console.log("Analytics updated.")
}

emitter.on("userRegistered", (user) => {
    sendWelcomeEmail();
})

emitter.on("userRegistered", (user) => {
    createAuditLog();
})

emitter.on("userRegistered", (user) => {
    updateAnalytics();
})

function registration(){
    console.log("Registering user...\n")
    console.log("User Registered successfully.\n")

    emitter.emit("userRegistered", user);
}

registration();

// i know passing user does not make any  sense, but as given in task , thats why i used it 