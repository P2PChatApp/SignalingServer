const Websocket = require("ws");
const readline = require("readline");
const parse = require("./lib/parse");

const client = new Websocket("ws://localhost:3000");

client.on("close",(code,reason)=>{
  console.log(`切断: ${code} ${reason}`);
});

client.on("error",(error)=>{
  console.log(`エラー: ${error}`);
});

client.on("open",()=>{
  console.log("接続");

  client.send(JSON.stringify({
    "event": "AUTH",
    "data": "Seg4shP"
  }));
});

client.on("message",(_data)=>{
  const data = parse(_data.toString());
  if(!data) return;

  console.log(data);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.prompt();

rl.on("line",(line)=>{
  client.send(JSON.stringify({
    "event": "TEST",
    "address": "Seg4sh"
  }))
});