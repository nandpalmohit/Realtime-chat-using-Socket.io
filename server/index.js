// node server which will handle socket.io connections
const io = require("socket.io")(5600);

const users = {}; // all users name connected with the server

// connect the browser / client-server
io.on("connection", (socket) => {
  // If any new user joins, let other people know connect with the server
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name; // passing the name of the user
    socket.broadcast.emit("user-joined", name); // broadcast the joined user
  });

  // if any user sends a message, broadcast it to other people
  socket.on("send", (message) => {
    // the data which will broadcast to other people
    socket.broadcast.emit("receive", {
      message: message.text, // message
      name: users[socket.id], // User name
      time: message.time, // time of message send
    });
  });

  // if some user leaves the chat, let other people know connect with the server
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]); // passing the name of user
    delete users[socket.id]; // delete user from server
  });
});
