var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000)

const arrUserInfo = [];

io.on('connection', socket => {
  socket.on('Nguoi-dung-dang-ky', user =>{
    // console.log(arrUserInfo.indexOf(user.ten));
    const isExist = arrUserInfo.some(e => e.ten === user.ten)
    socket.peerId = user.peerId;
    if(isExist){
      return socket.emit('Dang-ky-that-bai');
    }else{
      // console.log(user);
      arrUserInfo.push(user);
      // console.log(arrUserInfo);
      socket.emit('Danh-sach-user-online', arrUserInfo);
      socket.broadcast.emit('Co-nguoi-dung-moi', user);
    }
  })

  socket.on('disconnect', () =>{
    const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
    arrUserInfo.splice(index, 1);
    io.emit('Ai-do-ngat-ket-noi', socket.peerId);
  })
});
app.get("/", (req, res) => res.render("index"));
