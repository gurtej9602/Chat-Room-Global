const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

let users = {}; 

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("newUser", (username) => {
        users[socket.id] = username;
        io.emit("userJoined", username);
    });

    socket.on("newMessage", (message) => {
        io.emit("chat", message); 
    });

    socket.on("exitUser", () => {
        let username = users[socket.id];
        if (username) {
            io.emit("userLeft", username);
            delete users[socket.id];
        }
    });

    socket.on("disconnect", () => {
        let username = users[socket.id];
        if (username) {
            io.emit("userLeft", username);
            delete users[socket.id];
        }
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
