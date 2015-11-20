'use strict';

//https://en.wikipedia.org/wiki/Elder_Futhark
//http://rationalwiki.org/wiki/File:Runes_futhark_old.png
//https://en.wikipedia.org/wiki/Elder_Futhark
//http://rationalwiki.org/wiki/File:Runes_futhark_old.png
var RUNES = {},
    TAU = Math.PI * 2,
    EDGE_RADIUS = 50,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var drawLine = function drawLine(start, end) {
    var startPoint = randomPointAroundEdge(start),
        endPoint = randomPointAroundEdge(end);
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
},
    randomPointAroundEdge = function randomPointAroundEdge(point) {
    var randomRadius = Math.floor(Math.random() * EDGE_RADIUS) || 1,
        randomAngle = Math.random() * TAU;
    point.x += randomRadius * Math.cos(randomAngle);
    point.y += randomRadius * Math.sin(randomAngle);
},
    resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},
    animate = function animate() {
    drawLine({ x: 0, y: 0 }, { x: canvas.width, y: canvas.height });
    requestAnimationFrame(animate);
},
    initialize = function initialize() {
    context.strokeStyle = 'white';
    context.lineWidth = .5;
    resize();
    animate();
};

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);