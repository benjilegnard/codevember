'use strict';

var drawLine = true,
    drawOrigin = false,
    drawPoint = true,
    clearFrame = false;

var TAU = Math.PI * 2,
    POINTS_QUANTITY = 32,
    LINE_COLOR = 'rgba(0,0,0,0.6)',
    LINE_WIDTH = .25,
    POINT_COLOR = 'white',
    ROTATION_SPEED = TAU / 360,
    SPEED = 1,
    canvas = document.getElementById('c'),
    context = canvas.getContext('2d'),
    points = [],
    move = function move(point) {
    //rotate drawing point
    point.a += point.v;
    //move origin
    point.o.x += Math.cos(point.d) * SPEED;
    point.o.y += Math.sin(point.d) * SPEED;
    //calculate drawing point coordinates (rotates around point.o)
    point.x = point.o.x + Math.cos(point.a) * point.r;
    point.y = point.o.y + Math.sin(point.a) * point.r;
},

//reverse direction when the origin reach the border.
collide = function collide(point) {
    if (point.o.x < 0 || point.o.x > window.innerWidth) {
        point.d = TAU / 2 - point.d;
    }
    if (point.o.y < 0 || point.o.y > window.innerHeight) {
        point.d = -point.d;
    }
},
    draw = function draw(point) {
    //rotating point
    if (drawPoint) {
        context.fillStyle = POINT_COLOR;
        context.fillRect(point.x - 1, point.y - 1, 3, 3);
    }
    //origin point
    if (drawOrigin) {
        context.fillStyle = POINT_COLOR;
        context.fillRect(point.o.x - 1, point.o.y - 1, 3, 3);
    }
    //line between them
    if (drawLine) {
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(point.o.x, point.o.y);
        context.closePath();
        context.lineWidth = LINE_WIDTH;
        context.strokeStyle = LINE_COLOR;
        context.stroke();
    }
},
    resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},
    animate = function animate() {
    if (clearFrame) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    points.forEach(move);
    points.forEach(draw);
    points.forEach(collide);
    requestAnimationFrame(animate);
},
    createPoint = function createPoint() {
    return {
        //random position
        o: {
            x: Math.floor(Math.random() * window.innerWidth),
            y: Math.floor(Math.random() * window.innerHeight)
        },
        //placeholders, recalculated each frame.
        x: 0,
        y: 0,
        //random starting radian angle
        a: Math.random() * TAU,
        //random direction of the origin
        d: Math.random() * TAU,
        //radius of between point and its origin.
        r: Math.random() * 200,
        //either clockwise or counter-clockwise
        v: ROTATION_SPEED * (Math.random() > 0.5 ? -1 : 1)
    };
},
    initPoints = function initPoints() {
    for (var i = 0; i < POINTS_QUANTITY; i++) {
        points.push(createPoint());
    }
},
    clickHandler = function clickHandler(event) {
    var point = createPoint();
    point.o.x = event.clientX;
    point.o.y = event.clientY;
    points.push(point);
},
    initialize = function initialize() {
    resize();
    initPoints();
    animate();
};
window.addEventListener('resize', resize, false);
canvas.addEventListener('click', clickHandler);
document.addEventListener('DOMContentLoaded', initialize);