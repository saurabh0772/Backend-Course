const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.on("login", () => {
    console.log("User logged in")
});

emitter.on("purchase", () => {
    console.log("User made a purchase")
});

emitter.on("logout", () => {
    console.log("User logged out")
});


emitter.emit("login");
emitter.emit("purchase");
emitter.emit("logout");