console.log('Frontend working bro!');

let socket = io(); //import from the socket js file

let capture;
let ready = false;

//STEP 1. p5 setup

function setup(){
  createCanvas(windowWidth, windowHeight);

  //setup the capture
  capture = createCapture(VIDEO, {video:{ facingMode:"environment"}}, ()=>{
    console.log("video ready");
    ready = true;
  });

  capture.hide();

  noStroke();

}

function draw() {
  pushColor();
}

//average
//vars for the r g and b running count
//loop through every pixel in the camera array
//r + = this pixels r value, same for g and b
//divide r value by the number of pixel, floor it
//repeat for other channels
//return the the color value.
function averageColor(){
  capture.loadPixels();
  // console.log(capture.pixels.length);
  let r = g = b = 0; //weird, but init all variable to 0, chatgpt

  for (let i = 0; i < capture.pixels.length; i += 4) {
    r += capture.pixels[i];     // Red value
    g += capture.pixels[i + 1]; // Green value
    b += capture.pixels[i + 2]; // Blue value
  }

  let numPixels = capture.pixels.length/4;
  // console.log(r, g, b);
  let color = {r: floor(r/numPixels), g: floor(g/numPixels), b: floor(b/numPixels)};
  return color 
}

function pushColor(){
  //push your average color to the server
  if(ready){
    let color = averageColor(); //change the the average color
    socket.emit('color', color);   
  }
}

// function mouseMoved(){

  // ellipse(mouseX, mouseY, 20, 20);
  // socket.emit('data', {c: c, x: mouseX, y: mouseY});
// }


socket.on("connect", ()=> {
  console.log("socks are on", socket.id);
});

socket.on('color', (colors) => {
  // debugger;
  // fill(color.r, color.g, color.b);
  // rect(100, 100, 100, 100); //for testing
  //console.log(colors.length);
  let h = height/colors.length + 1;
  for(let i = 0; i < colors.length; i++){
    let y = i * h;
    let c = color(colors[i].color.r, colors[i].color.g, colors[i].color.b)
    fill(c);
    rect(0, y, width, h);

    if(socket.id == colors[i].id){
      fill(0);
      text("me", 10, y + 10);
    }
  }

});
