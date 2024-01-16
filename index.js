const WebSocket = require("ws");
require("dotenv").config();
const parse = require("./lib/parse");

const server = new WebSocket.Server({
  port: 3004
});

console.log("起動しました");

let peers = [];
server.on("connection",(socket)=>{
  console.log("接続");

  peers.push({"socket": socket});

  const timeout = setTimeout(()=>{
    peers = peers.filter(p=>p.socket !== socket);
    socket.close();
    console.log("認証失敗");
  },3000);

  socket.on("message",(_data)=>{
    const data = parse(_data.toString());
    if(!data) return;

    if(data.type === "AUTH"){
      console.log(`認証: ${data.client.id}`);
      clearTimeout(timeout);
      peers[peers.findIndex(p=>p.socket === socket)].address = data.client.id;
    }else if(peers.find(p=>p.socket === socket)?.address){
      if(data.address){
        const peer = peers.find(p=>p.address === data.address);
        if(!peer) return;

        console.log(`転送: ${JSON.stringify(data)}`);
        peer.socket.send(JSON.stringify(data));
      }else{
        console.log(`送信: ${JSON.stringify(data)}`);
        peers
          .filter(p=>p.socket !== socket&&p.address)
          .forEach(p=>p.socket.send(JSON.stringify(data)));
      }
    }
  });

  socket.on("close",()=>{
    console.log("切断");
    peers = peers.filter(p=>p.socket !== socket);
  });
});
