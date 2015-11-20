'use strict';

var GRAVITY = 0.8,
    TAU = Math.PI * 2,
    MAX_PARTICLES = 420,
    MAX_SPEED = 4,
    PARTICLE_FREQUENCY = 2,
    BASE_RADIUS = 12,
    RADIUS_REDUCTION_SPEED = 0.01,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    particles = [];

var getOrigin = function getOrigin() {
    return {
        x: window.innerWidth * .5,
        y: window.innerHeight * .85
    };
},
    origin = getOrigin(),
    frameCount = 0,
    resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    origin = getOrigin();
},
    randomColor = function randomColor() {
    var base = 126,
        offset = 255 - base,
        r = Math.floor(Math.random() * base + offset),
        g = Math.floor(Math.random() * base + offset),
        b = Math.floor(Math.random() * base + offset);
    return [r, g, b];
},

/**
 * reset or creates a new particle.
 */
particleFactory = function particleFactory(particle) {
    var p = particle || {};
    p.x = origin.x;
    p.y = origin.y;
    p.color = randomColor();
    p.angle = Math.random() * TAU / 6 - TAU / 3;
    p.deviation = (Math.random() > .5 ? -1 : 1) * .01;
    p.radius = BASE_RADIUS;
    p.speed = Math.random() * MAX_SPEED;
    return p;
},
    dead = function dead(particle) {
    return particle.radius < 0 || particle.x < 0 - particle.radius || particle.y < 0 - particle.radius || particle.x > canvas.width + particle.radius || particle.y > canvas.height + particle.radius;
},
    move = function move(particle) {
    particle.angle += particle.deviation;
    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed - GRAVITY;
    particle.radius -= RADIUS_REDUCTION_SPEED;
},
    draw = function draw(particle) {
    if (particle.radius > 0) {
        var alpha = 1;
        for (var radius = 1; radius <= particle.radius; radius++) {
            alpha = (particle.radius - radius) / particle.radius;
            context.beginPath();
            context.fillStyle = 'rgba(' + particle.color[0] + ',' + particle.color[1] + ',' + particle.color[2] + ',' + alpha + ')';
            context.arc(particle.x, particle.y, radius, 0, TAU, true);
            context.fill();
        }
    }
},
    animate = function animate(t) {

    //reset canvas
    //context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //Draw
    var aliveParticles = particles.filter(function (p) {
        return !dead(p);
    });
    aliveParticles.forEach(draw);
    aliveParticles.forEach(move);

    //new particle
    if (frameCount % PARTICLE_FREQUENCY == 0) {
        //don't create a new particle every time, for performance
        var deadParticles = particles.filter(dead);
        if (particles.length < MAX_PARTICLES && deadParticles.length == 0) {
            particles.push(particleFactory());
        } else {
            particleFactory(particles.filter(dead)[0]);
        }
    }
    frameCount++;
    requestAnimationFrame(animate);
},
    init = function init() {
    //context.globalCompositeOperation ='hard-light';
    resize();
    animate();
},
    changeOrigin = function changeOrigin(e) {
    origin.x = e.clientX;
    origin.y = e.clientY;
};
canvas.addEventListener('mousemove', changeOrigin);
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', resize);
canvas.addEventListener('mousedown', function (e) {
    origin.x = e.clientX;
    origin.y = e.clientY;
});
canvas.addEventListener('mouseout', function (e) {
    origin = getOrigin();
});