const WebSocket = require("ws");
const log4js = require("log4js");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const server = new WebSocket.Server({
    port: PORT,
});
const log = log4js.getLogger();
log.level = process.env.LOG_LEVEL || "info";

log.info(`Server running at ws://localhost:${PORT}`);

let sockets = [];
server.on("connection", (socket) => {
    log.trace("New connection");
    sockets.push(socket);

    socket.on("message", (message) => {
        log.trace(`Message received: ${message}`);
        sockets
            .filter((s) => s !== socket)
            .forEach((s) => s.send(message));
    });

    socket.on("close", () => {
        log.trace("Connection closed");
        sockets = sockets.filter((s) => s !== socket);
    });
});
