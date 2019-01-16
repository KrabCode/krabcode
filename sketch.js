
var coreR, outR, currR;
var expanding; //boolean which means shrinking if false
var spd = 1;
var pathToConfig = "/config.txt";

function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent("landing-sketch");
  smooth(8);
  background(0);

  //some default values
  coreR = 50;
  outR = 300;
  currR = coreR;
}

function draw() {
  noStroke();
  fill(0, 15);
  rect(0, 0, width, height);

  if (expanding) {
    currR+=spd;
  } else {
    currR-=spd;
  }
  if (currR <= coreR && !expanding) {
    expanding = !expanding;
  }
  if (currR >= outR && expanding) {
    expanding = !expanding;
  }

  push();
  translate(width/2, height/2);
  noStroke();
  fill(100);
  circle(coreR);
  strokeWeight(8);
  noFill();
  stroke(100);
  circle(outR);
  stroke(255);
  noFill();
  circle(currR);
  pop();
}

function circle( r) {
  ellipse(0, 0, r, r);
}
