const WebSocket = require("ws");
require("dotenv").config();
const parse = require("./lib/parse");

const server = new WebSocket.Server({
  port: 3000
});

console.log("起動しました");

let peers = [];
server.on("connection",(socket)=>{
  console.log("接続");

  peers.push({
    socket: socket
  });

  const timeout = setTimeout(()=>{
    peers = peers.filter(p=>p.socket !== socket);
  },5000);

  socket.on("message",(_data)=>{
    const data = parse(_data.toString());
    if(!data) return;
    console.log(`${data}`);

    if(data.event === "AUTH"){
      peers[peers.findIndex(p=>p.socket !== socket)].address = data.data;
    }else{
      const peer = peers.find(p=>p.address === data.address);
      if(peer){
        peer.socket.send(JSON.stringify(data));
      }else{
        peers
          .filter(p=>p.socket !== socket&&p.address)
          .forEach(p=>p.socket.send(JSON.stringify(data)))
      }
    }
  });

  socket.on("close",()=>{
    console.log("切断");
    peers = peers.filter(p=>p.socket !== socket);
  });
});