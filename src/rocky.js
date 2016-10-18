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
