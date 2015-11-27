'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COLORS = {
    RAY: [84, 196, 236],
    BG: [52, 52, 54]
},
    TAU = Math.PI * 2,
    SPACE_BETWEEN_CIRCLES = 20,
    CIRCLES_QUANTITY = 36,
    CIRCLES_WIDTH = 10,
    SPREAD_ANGLE = TAU / 6,
    SPREAD_FREQUENCY = 2,
    DRAW_LINE = false,
    DRAW_ARC = true;

var Circle = (function () {
    function Circle(radar, radius, alpha) {
        _classCallCheck(this, Circle);

        this.radar = radar;
        this.radius = radius;
        this.alpha = alpha || 1;
    }

    _createClass(Circle, [{
        key: 'move',
        value: function move(alpha) {
            this.alpha = alpha;
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            if (DRAW_ARC) {
                context.beginPath();
                context.lineWidth = CIRCLES_WIDTH;
                context.strokeStyle = 'rgba(' + COLORS.RAY[0] + ',' + COLORS.RAY[1] + ',' + COLORS.RAY[2] + ',' + this.alpha + ')';
                context.arc(this.radar.center.x, this.radar.center.y, this.radius, this.radar.direction + SPREAD_ANGLE / 2, this.radar.direction - SPREAD_ANGLE / 2, true);
                context.stroke();
            }
        }
    }]);

    return Circle;
})();

var Radar = (function () {
    function Radar() {
        _classCallCheck(this, Radar);

        this.circles = [];
        this.center = { x: 0, y: 0 };
        this.initialRadius = 30;
        this.currentCircleIndex = 0;
        this.direction = 0;
        for (var i = 0; i < CIRCLES_QUANTITY; i++) {
            this.circles.push(new Circle(this, this.initialRadius + i * SPACE_BETWEEN_CIRCLES));
        }
        this.mousePosition = {
            x: canvas.width,
            y: canvas.height / 2
        };
    }

    _createClass(Radar, [{
        key: 'resize',
        value: function resize(canvas) {

            //this.maxRadius = Math.min(canvas.width,canvas.height) / 2;
            this.center = {
                x: canvas.width / 2,
                y: canvas.height / 2
            };
        }
    }, {
        key: 'move',
        value: function move(frameCount) {
            this.direction = Math.atan2(this.mousePosition.y - this.center.y, this.mousePosition.x - this.center.x);

            for (var i = 0; i < this.circles.length; i++) {

                //const alpha = 1 - Math.abs(this.currentCircleIndex - i) / this.circles.length;
                var alpha = i < this.currentCircleIndex ? i / this.currentCircleIndex : 0;
                this.circles[i].move(alpha);
            }
            //next circle will be high alpha.
            if (frameCount % SPREAD_FREQUENCY == 0) {
                this.incrementIndex();
            }
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            this.circles.forEach(function (circle) {
                circle.draw(context);
            });
            if (DRAW_LINE) {
                context.beginPath();
                context.moveTo(this.center.x, this.center.y);
                context.lineTo(this.mousePosition.x, this.mousePosition.y);
                context.stroke();
            }
        }
    }, {
        key: 'incrementIndex',
        value: function incrementIndex() {
            if (this.currentCircleIndex < this.circles.length) {
                this.currentCircleIndex++;
            } else {
                this.currentCircleIndex = 0;
            }
        }
    }]);

    return Radar;
})();

var Scene = (function () {
    function Scene() {
        _classCallCheck(this, Scene);

        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.frameCount = 0;
    }

    _createClass(Scene, [{
        key: 'initialize',
        value: function initialize() {
            this.radar = new Radar();
            this.resize();
            this.animate();
            this.canvas.addEventListener('touchmove', function (event) {
                event.touches.forEach(function (touchEvent) {
                    window.scene.mouseMove(touchEvent);
                });
            });
            this.canvas.addEventListener('mousemove', function (event) {
                window.scene.mouseMove(event);
            });
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this = this;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = 'rgb(' + COLORS.BG[0] + ',' + COLORS.BG[1] + ',' + COLORS.BG[2] + ')';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.radar.move(this.frameCount);
            this.radar.draw(this.context);

            requestAnimationFrame(function () {
                _this.frameCount++;
                _this.animate();
            });
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.radar.resize(this.canvas);
        }
    }, {
        key: 'mouseMove',
        value: function mouseMove(event) {
            this.radar.mousePosition.x = event.pageX;
            this.radar.mousePosition.y = event.pageY;
        }
    }]);

    return Scene;
})();

document.addEventListener('DOMContentLoaded', function () {
    window.scene = new Scene();
    scene.initialize();
});
window.addEventListener('resize', function () {
    window.scene.resize();
});
//# sourceMappingURL=27.js.map
