var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  //res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

var userlist = [];

io.on('connection', function(socket){
  var room = '';
  console.log('a user connected');
  //socket.broadcast.emit('hi');
  
  userlist.push(socket);
  console.log(userlist);
  
  socket.on('client_to_server_join', function(data) {
    room = data.value;
    socket.join(room);
    console.log("join room :" + room);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var pos = userlist.indexOf(socket)
    userlist.splice(pos,1)
    console.log(userlist)
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    //io.emit('chat message', msg);
    io.to(room).emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

