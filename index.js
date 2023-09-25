const WebSocket = require("ws");
require("dotenv").config();
const parse = require("./lib/parse");

const server = new WebSocket.Server({
  port: 3000
});

console.log("起動しました");

let peers = [];
server.on("connection",(socket)=>{
  console.log(`接続: ${socket.remoteAddress}`);

  peers.push({
    socket: socket
  });

  const timeout = setTimeout(()=>{
    peers = peers.filter(p=>p.socket !== socket);
  },5000);

  socket.on("message",(_data)=>{
    const data = parse(_data.toString());
    if(!data) return;

    if(data.event === "AUTH"){
      console.log(`認証: ${data.data}(${socket.remoteAddress})`);
      peers[peers.findIndex(p=>p.socket !== socket)].address = data.data;
    }else{
      const peer = peers.find(p=>p.address === data.address);
      if(peer){
        console.log(`転送(${peer.socket.remoteAddress}): ${data}`);
        peer.socket.send(JSON.stringify(data));
      }else{
        console.log(`送信: ${data}`);
        peers
          .filter(p=>p.socket !== socket&&p.address)
          .forEach(p=>p.socket.send(JSON.stringify(data)))
      }
    }
  });

  socket.on("close",()=>{
    console.log(`切断: ${socket.remoteAddress}`);
    peers = peers.filter(p=>p.socket !== socket);
  });
});