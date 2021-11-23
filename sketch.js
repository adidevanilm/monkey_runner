var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monk, monk_running, monk_collided;
var ground, invisibleGround, groundImage;

var bananaGroup, bananaImage, banana;
var obstaclesGroup, obstacle1;

var score, score2;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var backImage

function preload(){
  monk_running = loadAnimation("0.png","1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png");
  monk_collided = loadAnimation("1.png");
  
  //groundImage = loadImage("Pik.png");
  
  backImage = loadImage("66.jpg")
  
  bananaImage = loadImage("banana.png");
  
  obstacle1 = loadImage("obstacle.png");

  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 300);
  var i = "hello"

  monk = createSprite(50,200 ,20,50);
  
  monk.addAnimation("running", monk_running);
  monk.addAnimation("collided", monk_collided);
  

  monk.scale = 0.5;
  
  ground = createSprite(600,267,650,20);
  ground.background = "red"
 // ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,265,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  bananaGroup = createGroup();

  
  monk.setCollider("rectangle",0,0,monk.width,monk.height);
  monk.debug = true
  
  score = 0;
  score2= 0;
  
}

function draw() {
  
  background(backImage);
  //displaying score
  fill("white ")
  textSize(16)
  text("SURVIVAL TIME: "+ score, 420,40);
  text("BANANAS:"+score2,50,40)
  //  console.log(i);

  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
      monk.changeAnimation("running", monk_running);
    monk.scale = 0.15;
    monk.collide(invisibleGround);
    ground.velocityX = - (4 + 3* score/100)
   // ground.scale=0.15
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
      ground.x = ground.width/2;
    
    
    //jump when the space key is pressed
    if(keyDown("space")&& monk.y >= 130) {
        monk.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    monk.velocityY = monk.velocityY + 0.8
  
    //spawn the clouds
    spawnBanana();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(monk)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
    if(bananaGroup.isTouching(monk)){
      score2 = score2+1;
      bananaGroup.destroyEach();
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the trex animation
      monk.changeAnimation("collided", monk_collided);
        if (mousePressedOver(restart)){
    reset();
  }

     
      ground.velocityX = 0;
      monk.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     bananaGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  monk.collide(invisibleGround);
 

  drawSprites();
}




function spawnObstacles(){
 if (frameCount %300 === 0){
   var obstacle = createSprite(600,230,10,40);
   obstacle.velocityX = -(4 + 3* score/100);
   
    obstacle.addImage(obstacle1)
   obstacle.scale=0.15

    //assign scale and lifetime to the obstacle           

    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnBanana() {
  //write code here to spawn the clouds
 if (frameCount % 170 === 0) {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(60,140));
    banana.addImage(bananaImage);
    banana.scale = 0.13;
    banana.velocityX = -3;
    
     //assign lifetime to the variable
    banana.lifetime = 200;
    
    //adjust the depth
    banana.depth = monk.depth;
    banana.depth = monk.depth + 1;
    
    //add each cloud to the group
    bananaGroup.add(banana);
  }
}
 function reset(){
   gameState = PLAY;
   obstaclesGroup.destroyEach();
   bananaGroup.destroyEach();
   score = 0;
   score2 = 0;
 }
