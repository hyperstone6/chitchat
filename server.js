const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server)

app.use(express.static(path.join(__dirname, "public")));
//Run when client connects
io.on("connection", socket => {
  console.log("new websocket connection");
  socket.emit('message', 'Welcome to Chitter-Chatter')
  //Broadcast when a user connects. 
  //Broadcast emits to all but exept current user
  socket.broadcast.emit('message', 'A user has joined the chat')
  //Run when a user disconnects
  socket.on('disconnect', ()=> {
      io.emit('message', 'A user has left the chat')
  })

  //Listen for chat message
  socket.on('chatMessage', (msg)=> {
    io.emit('message', msg)
  })
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
