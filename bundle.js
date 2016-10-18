(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./entity.js":2,"./game.js":3,"./laser.js":4,"./player.js":5,"./rocky.js":6}],2:[function(require,module,exports){
//Template based off Nathan Bean's lecture notes
"use strict";

module.exports = exports = Entity;

function Entity() {

}

Entity.prototype.checkForCollision = function(r1, r2) {
  if( (r1.position.y + r1.height < r2.position.y) || //r1 is above r2
      (r1.position.y > r2.position.y + r2.height) || //r1 is left r2
      (r1.position.x > r2.position.x + r2.width) ||  //r1 is right r2
      (r1.position.x + r1.width < r2.position.x) )   
    return false;
  else return true;
  };

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Laser class
 */
module.exports = exports = Laser;

/**
 * @constructor Laser
 * Creates a new Laser object
 * @param {Postition} position object specifying an x and y
 */
function Laser(angle, position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.angle = angle;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: -Math.sin(this.angle),
    y: -Math.cos(this.angle)
  }

  this.radius  = 64;
  this.thrusting = false;
  this.height = 5;
  this.width = 2;
  this.out = false;
  var self = this;

}

/**
 * @function updates the Laser object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Laser.prototype.update = function(time) {

  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  //Check if out of bounds
  if(this.position.x<0 || this.position.y<0 ||
     this.position.x>this.worldWidth || this.position.y> this.worldHeight)
     this.out = true;

}

/**
 * @function renders the Laser into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Laser.prototype.render = function(time, ctx) {
  ctx.save();
  ctx.strokeStyle = "red";
  // Draw Laser's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -this.height);
  ctx.stroke();

  ctx.restore();
}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.level = 1;
  this.lives = 10;
  this.width = 10;
  this.height =10;
  this.score = 0;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.shooting = false;

  var self = this;
  window.onkeydown = function(event) {

    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
      case 'Enter':
        self.shooting = true;
        break;
      case 'r':
        self.position = {
          x: (Math.random()*self.worldWidth),
          y: (Math.random()*self.worldHeight)
        };
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
      case 'Enter':
        self.shooting = false;
        break;
    }
  }
}


Player.prototype.shoot = function () {
  return this.shooting;
};
/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x/8;
    this.velocity.y -= acceleration.y/8;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();

  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Rocky class
 */
module.exports = exports = Rocky;

/**
 * @constructor Rocky
 * Creates a new Rocky object
 * @param {Postition} position object specifying an x and y
 */
function Rocky(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    //Random positive and negative solution from http://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
    x: Math.random()*Math.random()*(Math.random() < 0.5 ? -1 : 1),
    y: Math.random()*Math.random()*(Math.random() < 0.5 ? -1 : 1)
  }
  this.angle = Math.random();
  this.radius  = 20;
  this.thrusting = false;
  this.image = new Image();
  this.image.src = encodeURI('assets/rock.png');
  this.width = 40;
  this.height = 40;
  var self = this;

}

/**
 * @function updates the Rocky object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Rocky.prototype.update = function(time) {

  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x/100;
    this.velocity.y -= acceleration.y/100;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x+this.width < 0) this.position.x += this.worldWidth+this.width;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth +this.width;
  if(this.position.y+this.height < 0) this.position.y += this.worldHeight +this.height;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight +this.height;
}

/**
 * @function renders the Rocky into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Rocky.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw Rocky's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.drawImage(this.image,
                this.position.x, this.position.y, this.width, this.width);
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.arc(this.width/2,this.height/2,this.width,0,2*Math.PI);
  ctx.stroke();
  ctx.restore();
}

},{}]},{},[1]);
