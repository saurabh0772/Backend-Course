const EventEmitter = require("events")

const emitter = new EventEmitter();

const user = {
    id: 1,
    name: "Saurabh"
}

emitter.on("userRegistered", (user) => {
    console.log("Sending welcome email to ", user.name)
})

emitter.on("userRegistered", (user) => {
    console.log("Creating audit log for ", user.name);
})

emitter.on("userRegistered", (user) => {
    console.log("Updating analytics for ", user.name);
})


emitter.emit("userRegistered", user);