'use strict';

var GRAVITY = 0.8,
    TAU = Math.PI * 2,
    MAX_PARTICLES = 420,
    MAX_SPEED = 4,
    PARTICLE_FREQUENCY = 1,
    BASE_RADIUS = 20,
    RADIUS_REDUCTION_SPEED = 0.05,
    WOBBLE_FREQUENCY = 1,
    //5.5,
WOBBLE_ANGLE = TAU / 10,
    DIRECTION_CHANGE_SPEED = 0.16,
    COLOR_CHANGE_SPEED = 1,
    COLORS = [0x411517, 0x8B1B18, 0xC34319, 0xD39818, 0xDED56B, 0xFFF9B1],
    canvas = document.getElementById('c'),
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

/**
 * @param from : color to be an hexadecimal color, toIndex
 * @param toIndex : an index  a color in COLORS array to fade to
 */
colorCycle = function colorCycle(from, toIndex) {
    var r = from >> 16,
        g = from >> 8 & 0xFF,
        b = from & 0xFF,
        r2 = COLORS[toIndex] >> 16,
        g2 = COLORS[toIndex] >> 8 & 0xFF,
        b2 = COLORS[toIndex] & 0xFF;
    if (r < r2) r += COLOR_CHANGE_SPEED;else if (r > r2) r -= COLOR_CHANGE_SPEED;
    if (g < g2) g += COLOR_CHANGE_SPEED;else if (g > g2) g -= COLOR_CHANGE_SPEED;
    if (b < b2) b += COLOR_CHANGE_SPEED;else if (b > b2) b -= COLOR_CHANGE_SPEED;
    return r << 16 | g << 8 | b;
},

/**
 * reset or creates a new particle.
 */
particleFactory = function particleFactory(particle) {
    var p = particle || {};
    p.x = origin.x;
    p.y = origin.y;
    p.color = COLORS[0];
    p.colorIndex = 0;
    p.angle = Math.random() * TAU;
    //p.angle = ;
    p.radius = BASE_RADIUS;
    p.speed = Math.random() * MAX_SPEED + 1;
    return p;
},

/**
 * Consider a particle dead if it is outside canvas
 * or if its radius is negative.
 */
dead = function dead(particle) {
    return particle.radius <= 0 || particle.x < 0 - particle.radius || particle.y < 0 - particle.radius || particle.x > canvas.width + particle.radius || particle.y > canvas.height + particle.radius;
},

//calculates the direction to go to from a given particle.
//used to make the particle go up
angleToTop = function angleToTop(particle) {
    var target = {
        x: canvas.width / 2,
        y: 0
    };
    return Math.atan2(target.y - particle.y, target.x - particle.x);
},

/**
 * Move the particle
 */
move = function move(particle) {
    //wobble effect
    var angle = particle.angle + Math.sin(frameCount * WOBBLE_FREQUENCY) * WOBBLE_ANGLE;

    particle.x += Math.cos(angle) * particle.speed;
    particle.y += Math.sin(angle) * particle.speed - GRAVITY;
    //slowly change angle towards the top
    var targetAngle = angleToTop(particle);
    //if(particle.angle < TAU-TAU/4 && particle.angle > TAU/4 ){
    if (particle.angle > targetAngle) {
        particle.angle += DIRECTION_CHANGE_SPEED;
        //}
    } else {
            particle.angle -= DIRECTION_CHANGE_SPEED;
            //}
        }
},
    resetAngle = function resetAngle(angle) {
    return angle;
},
    evolve = function evolve(particle) {
    //slowly reduce circle size
    particle.radius -= RADIUS_REDUCTION_SPEED;
    //fade towards next color
    if (particle.colorIndex + 1 < COLORS.length) {
        particle.color = colorCycle(particle.color, particle.colorIndex + 1);
    }
    //next color
    if (COLORS[particle.colorIndex + 1] == particle.color) {
        particle.colorIndex++;
    }
},
    draw = function draw(particle) {
    if (particle.radius > 0) {
        context.fillStyle = '#' + particle.color.toString(16);
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, TAU, true);
        context.fill();
    }
},
    animate = function animate(t) {

    //reset canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //Draw
    var aliveParticles = particles.filter(function (p) {
        return !dead(p);
    }).sort(function (a, b) {
        //draw bigger first
        if (a.radius > b.radius) {
            return -1;
        }
        if (a.radius < b.radius) {
            return 1;
        }
        return 0;
    });
    aliveParticles.forEach(draw);
    aliveParticles.forEach(move);
    aliveParticles.forEach(evolve);

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
    activateGoo = function activateGoo() {
    canvas.classList.toggle('gooey');
},
    init = function init() {
    document.getElementById('activateGoo').addEventListener('change', activateGoo);
    resize();
    animate();
},
    changeOrigin = function changeOrigin(e) {
    origin.x = e.clientX;
    origin.y = e.clientY;
};
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', resize);
canvas.addEventListener('mousedown', changeOrigin);
canvas.addEventListener('mousemove', changeOrigin);
document.addEventListener('mouseleave', function (e) {
    origin = getOrigin();
});