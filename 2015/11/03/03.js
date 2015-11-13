'use strict';

/**
 * Created by jibhaine on 03/11/15.
 */
var PARTICLE_FREQUENCY = 8,
    //number of frames between each particle generation
MAX_PARTICLES = 256,
    //maximum
SCALE = 5,
    //used to calculate size of particle from z position.
MAX_DEPTH = 400,
    //used to calculate size of particle from z position.
PARTICLE_LIFE = 360,
    ROTATION_SPEED = 0.07,
    //Radian angle added each frame.
MAX_SPEED = 3,
    //pixels per frame
HORIZONTAL_SPEED = 0.3,
    //speed at wich the particle goes away from the center
VERTICAL_SPEED = 0.7,
    //
COLORS = [0x0F6F78, 0x0CB378, 0x1864AE, 0x761665, 0xA8187B, 0xC56916, 0x047D13],
    TAU = 2 * Math.PI;
//Globals
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    particles = [],
    origin = getOrigin(),
    frameCount = 0;
function getOrigin() {
    return {
        x: window.innerWidth * .5,
        y: window.innerHeight * .95,
        z: 10
    };
}
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    origin = getOrigin();
}
/**
 * reset or creates a new particle.
 */
function particleFactory(particle) {
    var p = particle || {};
    p.x = origin.x;
    p.y = origin.y;
    p.z = origin.z;
    p.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    p.speed = Math.random() * MAX_SPEED + 1; //+1 to avois static particle
    p.distanceFromCenter = 0;
    p.angle = Math.random() * TAU;
    p.radius = 0; //distance from origin
    return p;
}

function draw(particle) {
    if (!isDead(particle)) {
        var particleSize = (MAX_DEPTH + particle.z) / MAX_DEPTH * SCALE;
        //fix cause we can't draw an arc with a negative radius
        if (particleSize < 0) {
            particleSize = 1;
        }
        context.fillStyle = '#' + particle.color.toString(16);
        context.beginPath();
        context.arc(particle.x, particle.y, particleSize, 0, TAU, true);
        context.fill();
    }
}

function move(particle) {
    //
    particle.distanceFromCenter += HORIZONTAL_SPEED;
    particle.angle += ROTATION_SPEED;

    //goes up slowly
    particle.y -= VERTICAL_SPEED;
    particle.x = origin.x + Math.cos(particle.angle) * particle.distanceFromCenter;
    particle.z = origin.z + Math.sin(particle.angle) * particle.distanceFromCenter;
}
/**
 * Consider a particle to be dead if it is outside canvas
 */
function isDead(particle) {
    return particle.x > canvas.width || particle.x < 0 || particle.y > canvas.height || particle.y < 0 || particle.life < 0;
}
/**
 * Iterate through particles
 */
function animate(timestamp) {
    //reset canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //Draw
    particles.forEach(draw);
    particles.forEach(move);

    //new particle
    if (frameCount % PARTICLE_FREQUENCY == 0) {
        //don't create a new particle every time, for performance
        var deadParticles = particles.filter(isDead);
        if (particles.length < MAX_PARTICLES && deadParticles.length == 0) {
            particles.push(particleFactory());
        } else {
            particleFactory(particles.filter(isDead)[0]);
        }
    }
    frameCount++;
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);

resize();
animate();