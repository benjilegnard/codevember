'use strict';

var TAU = Math.PI * 2,
    COLORS = [0x2C4549, 0x78BDB0, 0x81CFB6, 0x8BE1BC, 0xC6F7E2],
    POINTS_QUANTITY = 64,
    LINE_WIDTH = .25,
    MIN_DRAW_DISTANCE = 50,
    MAX_DRAW_DISTANCE = 200,
    ROTATION_SPEED = TAU / 360,
    SPEED = 1,
    canvas = document.getElementById('c'),
    context = canvas.getContext('2d'),
    points = [];

var resizer = function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},
    animator = function animator() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#' + COLORS[0].toString(16);
    context.fillRect(0, 0, canvas.width, canvas.height);
    points.forEach(function (point) {
        movePoint(point);
        drawPoint(point);
        collisionDetector(point);
        //creates a table of points that are near the current one.
        points.filter(function (obj) {
            var distance = Math.sqrt(Math.pow(obj.x - point.x, 2) + Math.pow(obj.y - point.y, 2));
            return distance < MAX_DRAW_DISTANCE && distance > MIN_DRAW_DISTANCE;
        }).forEach(function (dest) {
            drawLine(point, dest);
            drawLine(dest, point);
        });
    });

    requestAnimationFrame(animator);
},
    drawPoint = function drawPoint(point) {
    context.fillStyle = '#' + COLORS[4].toString(16);
    context.fillRect(point.x - 1, point.y - 1, 3, 3);
    /*
    context.fillStyle = 'white';
    context.fillRect(point.o.x - 1, point.o.y - 1, 3, 3);*/
    /*
    context.beginPath();
    context.moveTo(point.x,point.y);
    context.lineTo(point.o.x,point.o.y);
    context.closePath();
    context.stroke();
    */
},

//draw zig zags
drawLine = function drawLine(origine, destination) {
    var angle = angleFromPoints(origine, destination),
        currentPoint = origine,
        distance = distanceFromPoints(origine, destination),
        step = distance / (Math.random() * 10 + 10);

    context.beginPath();
    context.moveTo(origine.x, origine.y);
    var interPoint = undefined;

    for (var i = 1; i * step < distance; i++) {
        currentPoint = {
            x: origine.x + Math.cos(angle) * i * step,
            y: origine.y + Math.sin(angle) * i * step
        };
        interPoint = pointPerpendicularTo(currentPoint, angle, Math.random() * 10, i % 2 == 0);
        context.lineTo(interPoint.x, interPoint.y);
    }
    context.lineTo(destination.x, destination.y);
    context.lineWidth = LINE_WIDTH;
    //choose color based on distance
    var distanceRatio = distance / (MAX_DRAW_DISTANCE - MIN_DRAW_DISTANCE);
    if (distanceRatio < 0.3) {
        context.strokeStyle = '#' + COLORS[2].toString(16);
    } else if (distanceRatio > 0.6) {
        context.strokeStyle = '#' + COLORS[3].toString(16);
    } else {
        context.strokeStyle = '#' + COLORS[1].toString(16);
    }
    context.stroke();
    context.closePath();
},
    pointPerpendicularTo = function pointPerpendicularTo(origin, angle, distance, leftOrRight) {
    return {
        x: origin.x + Math.cos(angle + (leftOrRight ? TAU / 4 : -TAU / 4)) * distance,
        y: origin.y + Math.sin(angle + (leftOrRight ? TAU / 4 : -TAU / 4)) * distance
    };
},
    angleFromPoints = function angleFromPoints(origine, destination) {
    return Math.atan2(destination.y - origine.y, destination.x - origine.x);
},
    distanceFromPoints = function distanceFromPoints(origine, destination) {
    return Math.sqrt((origine.x - destination.x) * (origine.x - destination.x) + (origine.y - destination.y) * (origine.y - destination.y));
},
    movePoint = function movePoint(point) {
    //rotate drawing point
    point.a += ROTATION_SPEED;
    //move origin
    point.o.x += Math.cos(point.d) * SPEED;
    point.o.y += Math.sin(point.d) * SPEED;
    //move drawing point
    point.x = point.o.x + Math.cos(point.a) * point.r;
    point.y = point.o.y + Math.sin(point.a) * point.r;
},

//if a point gets lost outside the canvas, put it back on the other side.
collisionDetector = function collisionDetector(point) {
    if (point.o.x < 0 || point.o.x > window.innerWidth) {
        point.d = TAU / 2 - point.d;
    }
    if (point.o.y < 0 || point.o.y > window.innerHeight) {
        point.d = -point.d;
    }
},
    createPoint = function createPoint() {

    return {
        //random position
        o: {
            x: Math.floor(Math.random() * window.innerWidth),
            y: Math.floor(Math.random() * window.innerHeight)
        },
        /*x: 0,
        y: 0,*/
        //random starting radian angle
        a: Math.random() * TAU,
        //direction of the origin
        d: Math.random() * TAU,
        r: Math.random() * 200,
        v: ROTATION_SPEED
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
    initializer = function initializer() {
    resizer();
    initPoints();
    requestAnimationFrame(animator);
};

window.addEventListener('resize', resizer, false);
canvas.addEventListener('click', clickHandler);
document.addEventListener('DOMContentLoaded', initializer);