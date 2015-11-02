'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    DEVIATION_SPEED = TAU / 180,
    DRAWING_SPEED = 2,
    RADIUS_FREQUENCY = 0.01,
    MAX_RADIUS = 42,
    INITIAL_POINTS = 15,
    points = [];

var frameCount = 0;

var WobblyCircle = (function () {
    function WobblyCircle(level, x, y, a) {
        _classCallCheck(this, WobblyCircle);

        this.level = level || 0;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.direction = a || TAU * Math.random();

        this.offset = TAU * Math.random();
        this.dirChangeFrequency = Math.floor(Math.random() * 120) + 20;
        this.deviation = (Math.random() > .5 ? -1 : 1) * (Math.random() * DEVIATION_SPEED);
    }

    //draw the line

    _createClass(WobblyCircle, [{
        key: 'draw',
        value: function draw(context) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.arc(this.x, this.y, this.radius + 1, 0, TAU, true);
            context.stroke();
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            context.stroke();
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            context.stroke();
        }

        //move according to direction + deviation

    }, {
        key: 'grow',
        value: function grow(frameCount) {
            this.direction = this.direction + this.deviation;
            this.x += Math.cos(this.direction) * DRAWING_SPEED;
            this.y += Math.sin(this.direction) * DRAWING_SPEED;
            this.radius = Math.abs(Math.cos(this.offset + frameCount * RADIUS_FREQUENCY)) * MAX_RADIUS;
            if (frameCount % this.dirChangeFrequency == 0) {
                this.direction = -this.direction;
            }
        }
    }, {
        key: 'collide',
        value: function collide(canvas) {
            if (this.x > canvas.width + this.radius) this.x = -this.radius;
            if (this.y > canvas.height + this.radius) this.y = -this.radius;
            if (this.x < -this.radius) this.x = canvas.width + this.radius;
            if (this.y < -this.radius) this.y = canvas.height + this.radius;
        }
    }]);

    return WobblyCircle;
})();

var Scene = (function () {
    function Scene() {
        _classCallCheck(this, Scene);

        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
    }

    _createClass(Scene, [{
        key: 'initialize',
        value: function initialize() {
            for (var i = 0; i < INITIAL_POINTS; i++) {
                points.push(new WobblyCircle());
            }
            this.resize();
            this.animate();
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this = this;

            // this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            points.forEach(function (point) {
                point.grow(frameCount);
                point.draw(_this.context);
                point.collide(_this.canvas);
            });
            frameCount++;
            requestAnimationFrame(function () {
                _this.animate();
            });
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }]);

    return Scene;
})();

document.addEventListener('DOMContentLoaded', function () {
    window.scene = new Scene();
    scene.resize();
    scene.initialize();
});
window.addEventListener('resize', function () {
    window.scene.resize();
});
//# sourceMappingURL=22.js.map
