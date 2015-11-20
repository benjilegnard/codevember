'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    ROTATION_SPEED = TAU / 180,
    CIRCLES_PER_SPIRAL = 24,
    GROW_SPEED = 1,
    MAX_SPIRALS = 3,
    ALPHA_DECAY = 0.00025,
    RESET_DELAY = 360,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    spirals = [],
    initialDirection = TAU * Math.random(),
    origin = {
    x: canvas.width / 2,
    y: canvas.height / 2
},
    mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

var frameCount = 0,
    circlesAdded = 0;

var Spiral = (function () {
    function Spiral() {
        _classCallCheck(this, Spiral);

        this.circles = [];
        this.init();
        this.reset();
    }

    _createClass(Spiral, [{
        key: 'reset',
        value: function reset() {
            this.life = 0.2;

            this.x = origin.x;
            this.y = origin.y;
            this.radius = 1;
            for (var i = 0; i < CIRCLES_PER_SPIRAL; i++) {
                this.circles[i].radius = this.radius / 2;
                // this.circles[i].angle =  i * (TAU / CIRCLES_PER_SPIRAL);
            }
        }
    }, {
        key: 'init',
        value: function init() {
            for (var i = 0; i < CIRCLES_PER_SPIRAL; i++) {
                this.circles.push(new Circle({
                    angle: i * (TAU / CIRCLES_PER_SPIRAL),
                    spiral: this,
                    color: i % 2 == 0
                }));
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            this.circles.forEach(function (c) {
                c.draw();
            });
        }
    }, {
        key: 'move',
        value: function move() {
            this.radius += GROW_SPEED;
            this.life -= ALPHA_DECAY;
            this.x += Math.cos(initialDirection);
            this.y += Math.sin(initialDirection);
            this.circles.forEach(function (c) {
                c.move();
            });
        }
    }]);

    return Spiral;
})();

var Circle = (function () {
    function Circle(props) {
        _classCallCheck(this, Circle);

        this.spiral = props.spiral;
        this.color = props.color;
        this.angle = props.angle;
        this.radius = this.spiral.radius / 3;

        this.x = this.spiral.x + Math.cos(this.angle) * this.radius;
        this.y = this.spiral.y + Math.sin(this.angle) * this.radius;
    }

    _createClass(Circle, [{
        key: 'move',
        value: function move() {
            this.radius += GROW_SPEED;
            this.angle -= ROTATION_SPEED;
            this.x = this.spiral.x + Math.cos(this.angle) * this.radius;
            this.y = this.spiral.y + Math.sin(this.angle) * this.radius;
        }
    }, {
        key: 'draw',
        value: function draw() {
            context.fillStyle = this.color ? 'rgb(0,0,0)' : 'rgba(255,255,255)';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            context.fill();
        }
    }]);

    return Circle;
})();

var resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    origin.x = canvas.width / 2;
    origin.y = canvas.height / 2;
},
    animate = function animate() {
    //Add new spiral
    if (frameCount % RESET_DELAY == 0) {
        if (spirals.length < MAX_SPIRALS) {

            spirals.push(new Spiral());
        }
    }
    frameCount++;
    //rest
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'xor';
    spirals.forEach(function (spiral) {
        spiral.move();
        spiral.draw();
    });

    //reset transparent spiral
    spirals.filter(function (s) {
        return s.life <= 0;
    }).forEach(function (s) {
        s.reset();
    });

    requestAnimationFrame(animate);
},
    initialize = function initialize() {
    resize();
    animate();
};

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);