var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/join.html');
});

app.post('/', (req, res) => {
  user = req.body.username
  res.redirect('/news');
})

let users = 0;

app.get('/news', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.of('/news').on('connection', function (socket) {
  users += 1;
  socket.broadcast.emit('users', users);
  socket.emit('users', users);
  socket.on('chat message', function (user, msg) {
    socket.emit('chat message',user, msg);
    socket.broadcast.emit('chat message',user, msg);
  });

  socket.on('join', function(data) {
    socket.emit('joined', data)
    socket.broadcast.emit('joined', data)
});

  socket.on('disconnect', () => {
    users -= 1;
    socket.broadcast.emit('users', users);
    socket.broadcast.emit('left', `User Left`);  })
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
