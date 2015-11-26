'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    CURVES_PER_CIRCLE = 36,
    DEV_FREQUENCY = 0.1,
    DEVIATION = 60,
    ROTATION_SPEED = TAU / 1200,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    origin = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
},
    circles = [];

var radius = window.innerHeight / 3,
    frameCount = 0;
/**
 * The curve, is a bezier line that goes from center to target, and its control point are moving
 */

var Curve = (function () {
    function Curve(angle, circle, alpha) {
        _classCallCheck(this, Curve);

        this.angle = angle;
        this.parent = circle;
        this.alpha = alpha;
        this.target = {
            x: origin.x + Math.cos(this.angle) * this.parent.radius,
            y: origin.y + Math.sin(this.angle) * this.parent.radius
        };
        this.ctrl1 = this.controlPoint(true);
        this.ctrl2 = this.controlPoint(false);
    }

    _createClass(Curve, [{
        key: 'draw',
        value: function draw() {
            var color = 'rgba(' + this.parent.color[0] + ',' + this.parent.color[1] + ',' + this.parent.color[2] + ',' + this.alpha + ')';

            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.shadowBlur = 4;
            context.shadowColor = 'rgb(' + this.parent.color[0] + ',' + this.parent.color[1] + ',' + this.parent.color[2] + ')';
            context.moveTo(origin.x, origin.y);

            context.bezierCurveTo(this.ctrl1.x, this.ctrl1.y, this.ctrl2.x, this.ctrl2.y, this.target.x, this.target.y);

            context.globalCompositeOperation = 'lighten';

            context.stroke();
        }
    }, {
        key: 'move',
        value: function move() {
            this.target = {
                x: origin.x + Math.cos(this.angle) * this.parent.radius,
                y: origin.y + Math.sin(this.angle) * this.parent.radius
            };
            //TODO move ctrlpoint1 perpendicular to the left from the middle of the radius
            //TODO move ctrlpoint2 perpendicular to the right from the middle of the radius
            this.ctrl1 = this.controlPoint(true);
            this.ctrl2 = this.controlPoint(false);
            this.angle += ROTATION_SPEED * this.parent.rotationDirection;
        }
    }, {
        key: 'controlPoint',
        value: function controlPoint(leftOrRight) {
            var middle = {
                x: origin.x + Math.cos(this.angle) * this.parent.radius / 2,
                y: origin.y + Math.sin(this.angle) * this.parent.radius / 2
            };
            var distance = Math.sin(this.parent.offset + frameCount * DEV_FREQUENCY) * DEVIATION * (leftOrRight ? 1 : -1);
            //add TAU/4 to have perpendicular angle, from this curve.
            return {
                x: middle.x + Math.cos(this.angle + TAU / 4) * distance,
                y: middle.y + Math.sin(this.angle + TAU / 4) * distance
            };
        }
    }]);

    return Curve;
})();

var Circle = (function () {
    function Circle(color, amount, direction, radiusRatio) {
        _classCallCheck(this, Circle);

        this.color = color;
        this.numberOfCurves = amount || CURVES_PER_CIRCLE;
        this.curves = [];
        this.radiusRatio = radiusRatio;
        this.setRadius(Math.min(origin.x, origin.y) - 10);
        this.offset = Math.random() * 360;
        this.initialize();
        this.rotationDirection = direction;
    }

    _createClass(Circle, [{
        key: 'initialize',
        value: function initialize() {
            for (var i = 0; i < this.numberOfCurves; i++) {
                this.curves.push(new Curve(TAU / this.numberOfCurves * i, this, i / this.numberOfCurves));
            }
        }
    }, {
        key: 'animate',
        value: function animate() {
            this.curves.forEach(function (curve) {
                curve.draw();
                curve.move();
            });
            if (frameCount % Math.floor(this.numberOfCurves / 4) == 0) {
                for (var i = 1; i < this.numberOfCurves; i++) {
                    this.curves[i - 1].alpha = this.curves[i].alpha;
                }
                this.curves[this.numberOfCurves - 1].alpha = this.curves[0].alpha;
            }
        }
    }, {
        key: 'setRadius',
        value: function setRadius(radius) {
            this.radius = this.radiusRatio * radius;
        }
    }]);

    return Circle;
})();

var resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    origin.x = window.innerWidth / 2;
    origin.y = window.innerHeight / 2;
    circles.forEach(function (circle) {
        circle.setRadius(Math.min(origin.x, origin.y) - 10);
    });
},
    animate = function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(function (circle) {
        return circle.animate();
    });
    frameCount++;
    requestAnimationFrame(animate);
},
    initialize = function initialize() {
    circles.push(new Circle([255, 183, 57], 36, 1, 1.1));
    circles.push(new Circle([66, 182, 163], 15, -1, .8));
    circles.push(new Circle([104, 86, 193], 8, 1, 1));
};

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', function () {
    resize();
    initialize();
    animate();
});
//# sourceMappingURL=26.js.map
