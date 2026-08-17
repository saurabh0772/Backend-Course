const EventEmitter = require("events")

const emitter = new EventEmitter();

emitter.on("info", (msg) => {
    console.log("[INFO] ", msg);
})

emitter.on("warning", (msg) => {
    console.log("[WARNING] ", msg);
})

emitter.on("error", (msg) => {
    console.log("[ERROR] ", msg);
})

emitter.emit("info", "Server started");
emitter.emit("warning", "Memory usage is high");
emitter.emit("error", new Error("Database connection failed"));
