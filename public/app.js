console.log('The page is working!');

//STEP 1. p5 setup
let c;

function setup(){
  createCanvas(windowWidth, windowHeight);

  background(0, 255, 0);

  c = {r: floor(random(0,255)), g: floor(random(0,255)), b: floor(random(0,255))}

}


function mouseMoved(){

  // ellipse(mouseX, mouseY, 20, 20);
  socket.emit('data', {c: c, x: mouseX, y: mouseY});
}

let socket = io();

socket.on("connect", ()=> {
  console.log("socks are on", socket.id);
});

socket.on('data', (data) => {
  // debugger;
  fill(data.c.r, data.c.g, data.c.b);
  ellipse(data.x, data.y, 20, 20);
});
