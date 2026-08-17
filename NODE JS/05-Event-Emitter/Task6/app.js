    const EventEmitter = require("events")

    const emitter = new EventEmitter();

    emitter.once("serverStarted", () => {
        console.log("Server started!")
    })

    emitter.emit("serverStarted");
    emitter.emit("serverStarted");
    emitter.emit("serverStarted");