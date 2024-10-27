//Express server setup
let express = require('express');
let app = express();

//Serve public folder
app.use(express.static('public'));

//Step 2. HTTP Server
let http = require('http');
let server = http.createServer(app);

// socket io server
const { Server } = require('socket.io');
const io = new Server(server);

//Listen
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('Server is listening on localhost: ' + port);
});


//routes
io.on('connection', (socket) => {
  console.log('We have a new client: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('A client disconnected', socket.id);
  });

  socket.on('data', (data) => {
    console.log(data);

    //send to all clients, including us
    io.emit('data', data);

    //send to all clients, except us
    //socket.broadcast.emit('data', data);

    //send only to ourselves
    //socket.emit('data', data);

  });


});



