const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var balls = []
var boats = []
var boatAni = []
var brokenAni = []
var score = 0

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatPng = loadImage("./assets/boatani.png")
  boatJ = loadJSON("./assets/boat.json")
  brokenB = loadImage("./assets/broken_boat.png")
  brokenJ = loadJSON("./assets/broken_boat.json")
  music = loadSound("assets_background_music.mp3")
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  music.play()
  music.setVolume(0.4)
  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);
  ground = Bodies.rectangle(600, 580, 1200, 20, { isStatic: true });
  World.add(world, ground);
  cannon = new Cannon(180, 110, 130, 100, 100);

  boatFrames = boatJ.frames
  for (var i=0; i<boatFrames.length; i++){
    var pos = boatFrames[i].position
    var img = boatPng.get(pos.x, pos.y, pos.w, pos.h)
    boatAni.push(img)
  }
  brokenFrames = brokenJ.frames
  for (var i=0; i<brokenFrames.length; i++){
    var pos = brokenFrames[i].position
    var img = brokenB.get(pos.x, pos.y, pos.w, pos.h)
    brokenAni.push(img)
  }
}

function draw() {
  background(backgroundImg)
  Engine.update(engine);
  fill("black")
  textSize(25)
  text("Score: "+ score, 1000, 100)
  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  cannon.display();
  
  for (var i = 0; i<boats.length; i++){
    for (var e = 0; e<balls.length; e++){
        if (balls[e]){
          balls[e].display()
          if (balls[e].body.position.y>540){
            balls[e].remove(e)
            }
          }
      if (boats[i]!=undefined && balls[e]!=undefined){
      if (Matter.SAT.collides(boats[i].body, balls[e].body).collided){
        balls[e].remove(e)
        boats[i].remove(i)
        score = score + 1
        }
      }
    }
  }

  if(boats.length>0){
    if(boats[boats.length - 1] === undefined ||boats[boats.length-1].body.position.x < width -200){
      boat = new Boat(1200,550,170,170,boatAni)
      boats.push(boat)
    }
    for(var i=0;i<boats.length;i++){
      if(boats[i]){
      boats[i].display()
      boats[i].animate()
      Matter.Body.setVelocity(boats[i].body,{x:-1,y:0})
      if (Matter.SAT.collides(tower, boats[i].body).collided){
        swal({
          title: "Game Over", 
          text: "Thanks For Playing!",
          confirmButtonText: "Play Again"
        },
        function (isConfirm){
          if (isConfirm){
            location.reload()
          }
        }
        )
      }
    }
  }
  }
  else{
    boat = new Boat(1200,550,170,170,boatAni)
    boats.push(boat)
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall)
  }
}


function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length-1].shoot();
      } 
    }
  