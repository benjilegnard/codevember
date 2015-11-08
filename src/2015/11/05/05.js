const TAU = Math.PI * 2;
const CIRCLES_PER_GEN = 32;
const MAX_CIRCLES = 512;
const COLOR_FREQUENCY = 0.0314;
const GEN_FREQUENCY = 10;
const CIRCLE_SPEED = 1.6;
const CIRCLE_RADIUS = 6;
const ANGULAR_VARIATION = TAU / 6; //angle range in radiant in wich to change the direction.
const VARIATION_FREQ = 0.01;

let
    frameCount = 0,
    origin = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    },
    circles = [],
    canvas = document.getElementById('c'),
    context = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function circleFactory(opts) {
    let circle = opts || {};
    circle.x = opts.y;
    circle.y = opts.y;
    circle.initialTimestamp = opts.initialTimestamp;
    circle.color = cycleColor(opts);
    circle.direction = opts.direction;
    circle.recycled = true;
    return circle;
}

function cycleColor(circle, timestamp) {
    let i = Math.floor(circle.initialTimestamp || timestamp) / 100,
        r = Math.sin(COLOR_FREQUENCY * i + TAU / 3) * 127 + 128,
        g = Math.sin(COLOR_FREQUENCY * i + TAU / 3 * 2) * 127 + 128,
        b = Math.sin(COLOR_FREQUENCY * i + TAU) * 127 + 128;

    return (r << 16 | g << 8 | b);
}

function draw(circle) {
    context.fillStyle = '#' + circle.color.toString(16);
    context.beginPath();
    context.arc(circle.x, circle.y, CIRCLE_RADIUS, 0, TAU, true);
    context.fill();
}

function move(circle) {
    let variation = Math.sin(frameCount * VARIATION_FREQ) * ANGULAR_VARIATION;

    circle.x += Math.cos(circle.direction + variation) * CIRCLE_SPEED;
    circle.y += Math.sin(circle.direction + variation) * CIRCLE_SPEED;
}
//distance between two points.
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

function isDead(circle) {
    //point dead if outside canvas (buggy)
    //return (circle.x < -CIRCLE_RADIUS || circle.y < -CIRCLE_RADIUS || circle.x > canvas.width || circle.y>canvas.height);
    //consider a point dead if it is further from the diagonal of the screen than from the center.
    return distance({x: canvas.width,y: canvas.height}, origin) < distance(circle, origin);
}
//generate a new wave of particles
function particleWave(timestamp) {
    for (let i = 0; i < CIRCLES_PER_GEN; i++) {
        var deadCircles = circles.filter(isDead);
        var circle = deadCircles[0] || {};
        circle.initialTimestamp = timestamp;
        circle.x = origin.x;
        circle.y = origin.y;
        circle.direction = (TAU / CIRCLES_PER_GEN) * i;
        if (circle.recycled) {
            circle = circleFactory(circle);
        } else {
            circles.push(circleFactory(circle));
        }
    }
}

function cleanUp(circle) {
    if (isDead(circle)) {
        circles.splice(circles.indexOf(circle), 1);
        deadCircles.push(circle);
    }
}

function animate(timestamp) {
    //reset canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //Draw
    circles.forEach(draw);
    circles.forEach(move);

    if (frameCount % GEN_FREQUENCY == 0) {
        particleWave(timestamp);
    }
    frameCount++;
    requestAnimationFrame(animate);
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    origin = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
}
window.addEventListener( 'resize', resize );
document.addEventListener('DOMContentLoaded',function(event){
    resize();
    animate(1);
});