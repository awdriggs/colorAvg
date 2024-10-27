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




let colors = [];

//routes
io.on('connection', (socket) => {

  console.log('We have a new client: ' + socket.id);

  socket.on('disconnect', () => {
    let indexOfSocket = colors.findIndex(item => item.id === socket.id);

    console.log('A client disconnected', socket.id, indexOfSocket);
    //clear my space in the colors obj
    //call splice
    if (indexOfSocket !== -1) {
      // Remove the item at the found index
      colors.splice(indexOfSocket, 1);
    }
  });

  console.log(socket.id);

  socket.on('color', (color) => {
    // console.log(socket.id, color);

    //using the socket id, find the index of the id key in the array
    //if the id already exists in the array, update it, else make a new array item
    let indexOfSocket = colors.findIndex(item => item.id === socket.id);

    if(indexOfSocket == -1){ //socket info doesn't exist yet
      colors.push({id: socket.id, color: color});
    } else {
      colors[indexOfSocket].color = color; //update existing color
    }

    // console.log(colors);

    //send to all clients, including us
    io.emit('color', colors); //send the array of colors

    //send to all clients, except us
    //socket.broadcast.emit('data', data);

    //send only to ourselves
    //socket.emit('data', data);

  });


});



