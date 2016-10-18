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
