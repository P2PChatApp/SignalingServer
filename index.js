const WebSocket = require("ws")
const server = new WebSocket.Server({
  port: 3001
});

console.log("シグナリングサーバーを起動しました")

let sockets = []
server.on("connection",(socket)=>{
  sockets.push(socket)

  socket.on("message",(message)=>{
    sockets.forEach((s) => s.send(message))
  })

  socket.on("close",()=>{
    sockets = sockets.filter((s) => s !== socket)
  })
})
