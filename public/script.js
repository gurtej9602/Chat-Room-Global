(function () {
    const app = document.querySelector(".app");
    const socket = io();
    let uname;

    document.querySelector("#joinButton").addEventListener("click", function () {
        let username = document.querySelector("#Username").value.trim();

        if (username.length === 0) {
            alert("Please enter a username!");
            return;
        }

        socket.emit("newUser", username);
        uname = username;

        document.querySelector(".JoinScreen").classList.remove("active");
        document.querySelector(".ChatScreen").classList.add("active");
    });

    document.querySelector("#sendButton").addEventListener("click", function () {
        let message = document.querySelector("#messageBox").value.trim();
        if (message.length === 0) {
            alert("Please enter a message!");
            return;
        }

        socket.emit("newMessage", {
            username: uname,
            text: message
        });

        document.querySelector("#messageBox").value = "";
    });

    document.querySelector("#Exit").addEventListener("click", function () {
        if (uname) {
            socket.emit("exitUser", uname);
        }

        document.querySelector(".ChatScreen").classList.remove("active");
        document.querySelector(".JoinScreen").classList.add("active");

        uname = null;
    });
    
    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    socket.on("newMessage", function (data) {
        renderMessage("other", data);
    });

    socket.on("userJoined", function (username) {
        renderMessage("update", `${username} has joined the chat.`);
    });

    socket.on("userLeft", function (username) {
        renderMessage("update", `${username} has left the chat.`);
    });

    function renderMessage(type, message) {
        let messageContainer = document.querySelector(".ChatScreen .messages");
        let el = document.createElement("div");

        if (type === "my") {
            el.classList.add("message", "myMessage");
            el.innerHTML = `<div><div class="you">You</div><div class="yourMessage">${message.text}</div></div>`;
        } else if (type === "other") {
            el.classList.add("message", "othersMessage");
            el.innerHTML = `<div><div class="you">${message.username}</div><div class="yourMessage">${message.text}</div></div>`;
        } else if (type === "update") {
            el.classList.add("Joined");
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
})();
