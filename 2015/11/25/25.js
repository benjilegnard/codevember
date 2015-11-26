'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    DEVIATION_SPEED = TAU / 360,
    MAX_PARTICLES = 24,
    //number of particles
MAX_LIFE = 120,
    //in frames
RADIUS = 1,
    DRAWING_SPEED = 4,
    canvas = document.getElementById('canvas'),
    seamless = document.getElementById('seamless'),
    context = canvas.getContext('2d'),
    particles = [];

var Particle = (function () {
    function Particle(x, y, a) {
        _classCallCheck(this, Particle);

        this.x = x;
        this.y = y;
        this.direction = a;
        this.radius = RADIUS;
        this.color = 'black';
        this.offset = TAU * Math.random();
        this.deviation = TAU * Math.random();
        this.distance = 0;
    }

    _createClass(Particle, [{
        key: 'move',
        value: function move() {
            this.distance += .1;
            this.deviation += DEVIATION_SPEED;
            this.direction = this.direction + this.deviation;
            this.x += Math.cos(this.direction) * (DRAWING_SPEED + this.distance);
            this.y += Math.sin(this.direction) * (DRAWING_SPEED + this.distance);
        }
    }, {
        key: 'draw',
        value: function draw() {
            context.globalCompositeOperation = 'xor';
            context.beginPath();
            context.fillStyle = this.color;
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            //context.fillRect(Math.floor(this.x),Math.floor(this.y),this.radius,this.radius);
            context.fill();
        }
    }, {
        key: 'collide',
        value: function collide(canvas) {
            if (this.x > canvas.width) this.x = 0;
            if (this.y > canvas.height) this.y = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y < 0) this.y = canvas.height;
        }
    }]);

    return Particle;
})();

var life = MAX_LIFE;
var refreshBackground = function refreshBackground() {
    //console.log(''+canvas.toDataURL());
    document.body.style.backgroundImage = 'url(' + canvas.toDataURL().replace('\"', '\'') + ')';
},
    animate = function animate() {
    //context.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (part) {
        part.draw();
        part.move();
        part.collide(canvas);
    });
    refreshBackground();
    life--;
    if (life < 0) {
        refreshBackground();
    } /*else{
         requestAnimationFrame(animate);
      }*/
},
    initialize = function initialize() {
    for (var i = 0; i < MAX_PARTICLES; i++) {
        particles.push(new Particle(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), TAU * Math.random()));
    }
    while (life > 0) {
        animate();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    initialize();
    animate();
});
//# sourceMappingURL=25.js.map
