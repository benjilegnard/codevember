'use strict';

//https://en.wikipedia.org/wiki/Elder_Futhark
//http://rationalwiki.org/wiki/File:Runes_futhark_old.png
//https://en.wikipedia.org/wiki/Elder_Futhark
//http://rationalwiki.org/wiki/File:Runes_futhark_old.png
var RUNES = [{
    points: [[0, 0], [2, 2]]
}],
    TAU = Math.PI * 2,
    EDGE_RADIUS = 22,
    MAX_POINTS = 12,
    LINE_LENGTH = 250,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    points = [];

var frameCount = 0,
    currentDirection = TAU * Math.random();

var drawLine = function drawLine(start, end) {
    context.strokeStyle = 'rgba(255,255,255,1)';
    context.lineWidth = .5;
    randomPointAroundEdge(start);
    randomPointAroundEdge(end);
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
},
    randomPointAroundEdge = function randomPointAroundEdge(point) {
    var randomRadius = Math.floor(Math.random() * EDGE_RADIUS) || 1,
        randomAngle = Math.random() * TAU;
    point.x += randomRadius * Math.cos(randomAngle);
    point.y += randomRadius * Math.sin(randomAngle);
},
    pointFactory = function pointFactory(point) {
    if (point) {
        point.x = Math.random() * canvas.width;
        point.y = Math.random() * canvas.height;
    } else {
        point = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
    }
    currentDirection = TAU * Math.random();
    return point;
},
    addPoint = function addPoint() {
    if (points.length <= MAX_POINTS) {
        points.push(pointFactory());
    } else {
        points.push(pointFactory(points.splice(0, 1)[0]));
    }
},
    resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},
    animate = function animate() {
    context.fillStyle = 'rgba(85,85,85,0.01)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (frameCount % 60 == 0) {
        addPoint();
    }
    frameCount++;
    for (var i = 1; i < points.length; i++) {
        drawLine(points[i - 1], points[i]);
    }
    requestAnimationFrame(animate);
},
    initialize = function initialize() {
    resize();
    animate();
};

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);
//# sourceMappingURL=20.js.map
