"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Rocky = require('./rocky.js');
const Laser = require('./laser.js');
const Entity = require('./entity.js');
/* Global variables */
var canvas = document.getElementById('screen');
var entity = new Entity();
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);
var rocks = [];
var lasers = [];
var level = 1;
for (var i = 0; i <= 10+level; i++) {
  rocks.push(new Rocky({x: Math.floor(Math.random()*canvas.width+5),
                          y: Math.floor(Math.random()*canvas.height+5)},
                          canvas ));
}


var breakApart = new Audio();
breakApart.src = "./assets/breakApart.wav";
var fail = new Audio();
fail.src = "./assets/fail.wav";
var chuchu = new Audio();
chuchu.src = "./assets/chuchu.wav";
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  if(player.lives > 0){
    player.update(elapsedTime);
    if(player.shoot()){
      chuchu.play();
      lasers.push(new Laser(player.angle,
                            {x: (player.position.x),
                             y: (player.position.y)},
                            canvas));
    }
    for (var i = 0; i < rocks.length; i++) {
      rocks[i].update(elapsedTime);
    }
    for (var i = 0; i < lasers.length; i++) {
      lasers[i].update(elapsedTime);
    }

    for (var i = 0; i < rocks.length; i++) {
      if(rocks[i]){
        if(entity.checkForCollision(rocks[i],player)){
            if(rocks[i].width>20){
            rocks[i].width = rocks[i].width/2;
            rocks[i].height = rocks[i].height/2;
          }else{
            rocks.splice(i,1);
          }
          player.lives--;
          document.getElementById('score').innerHTML =
           "Lives "+ player.lives + " Level: "+ player.level + " Score: "+ player.score;
           player.position.x = canvas.width/2;
           player.position.y = canvas.height/2;
           player.velocity = {
             x: 0,
             y: 0
           }
           fail.play();
      }
    }
    }
    if(rocks.length >0){
      for (var i = 0; i < rocks.length; i++) {
        for (var j = 0; j < lasers.length; j++) {
        if(entity.checkForCollision( rocks[i] , lasers[j] ) ){
           if(rocks[i].width>20){
             rocks[i].width = rocks[i].width/2;
             rocks[i].height = rocks[i].height/2;
           }else{
             rocks.splice(j,1);
           }
           breakApart.play();
           player.score++;
           document.getElementById('score').innerHTML =
            "Lives "+ player.lives + " Level: "+ player.level + " Score: "+ player.score;
        }
      }
    }
  }else{
    axisList = [];
    for (var i = 0; i <= 10+level; i++) {
      rocks.push(new Rocky({x: Math.floor(Math.random()*canvas.width+5),
                              y: Math.floor(Math.random()*canvas.height+5)},
                              canvas ));
      axisList.push(rocks[i]);
    }
    player.level++;
    player.position.x =canvas.width/2;
    player.position.y = canvas.height/2;
  }


    for (var i = 0; i < rocks.length; i++) {
      for (var j = 0; j < rocks.length; j++) {
      if(rocks[i] != rocks[j] &&
         entity.checkForCollision( rocks[i] , rocks[j] ) ){
         if(rocks[j].width>20){
           rocks[j].width = rocks[j].width/2;
           rocks[j].height = rocks[j].height/2;
         }else{
           rocks.splice(j,1);
         }
         breakApart.play();
      }
    }
    }


  }
  else{
    document.getElementById('score').innerHTML =
   "Game Over: "+"Final Score: "+player.score+ " Level: "+ player.level;
 }

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  if(player.lives > 0){
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
  for (var i = 0; i < rocks.length; i++) {
    rocks[i].render(elapsedTime, ctx);
  }

  for (var i = 0; i < lasers.length; i++) {
    if(!lasers[i].out){
      lasers[i].render(elapsedTime, ctx);
  }
}
}
}
