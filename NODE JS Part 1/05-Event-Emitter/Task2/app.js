const EventEmitter = require("events")

const emitter = new EventEmitter();

const user = {
    id: 1,
    name: "Saurabh", 
    email: "saurabh@example.com"
}

emitter.on("login", (user) => {
    console.log("User Logged In");
    console.log("Name: ", user.name);
    console.log("Email: ", user.email);
});

emitter.emit("login", user);


