'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    RADIUS_GROW_SPEED = .25,
    ROTATION_SPEED = TAU / 360,
    DEVIATION_SPEED = .2,
    NEW_CIRCLE_FREQ = 45,
    MAX_CIRCLES = 200,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    circles = [],
    initialDirection = TAU * Math.random(),
    origin = {
    x: canvas.width / 2,
    y: canvas.height / 2
};
var frameCount = 0,
    circlesAdded = 0;

var Circle = (function () {
    function Circle() {
        _classCallCheck(this, Circle);

        this.reset();
    }

    _createClass(Circle, [{
        key: 'reset',
        value: function reset() {
            circlesAdded++;
            this.x = origin.x;
            this.y = origin.y;
            this.radius = 1;
            this.color = circlesAdded % 2 == 0 ? 'white' : 'black';
            this.angle = initialDirection;
        }
    }, {
        key: 'grow',
        value: function grow() {
            this.radius += RADIUS_GROW_SPEED;
            this.angle += ROTATION_SPEED;
            this.x += Math.cos(this.angle) * DEVIATION_SPEED;
            this.y += Math.sin(this.angle) * DEVIATION_SPEED;
        }
    }, {
        key: 'draw',
        value: function draw() {
            context.fillStyle = this.color;
            context.strokeStyle = 'black';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            //context.stroke();
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
    frameCount++;
    context.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function (circle) {
        circle.grow();
        circle.draw();
    });

    if (frameCount % NEW_CIRCLE_FREQ == 0) {
        addCircle();
    }
    requestAnimationFrame(animate);
},
    addCircle = function addCircle() {
    if (circles.length > MAX_CIRCLES) {
        (function () {
            var diagonal = Math.sqrt(canvas.width ^ 2 * canvas.height ^ 2);
            circles.filter(function (circle) {
                return circle.radius > diagonal;
            })[0].reset();
        })();
    } else {
        circles.push(new Circle());
    }
    circles.sort(function (a, b) {
        return b.radius - a.radius;
    });
},
    initialize = function initialize() {
    resize();
    addCircle();
    animate();
};

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);
//# sourceMappingURL=15.js.map
