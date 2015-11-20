'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COLORS = [0x241E3E, 0x733260, 0x3B8688, 0xB0B489, 0xEBDDA4],
    DIRECTIONS = [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, 1], [0, -1], [1, 0], [-1, 0]],
    TAU = Math.PI * 2,
    STARS = 4,
    PIKES = 12,
    PIKE_RATIO = .4,
    DIR_CHANGE_FREQ = 30,
    PIXEL_SIZE = { MIN: 10, MAX: 20 },
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    origin = {
    x: canvas.width / 2,
    y: canvas.height / 2
};
/**
 * Pointy polygon,
 */

var Star = (function () {
    function Star(radius, center, color, oddOrEven) {
        _classCallCheck(this, Star);

        this.radius = radius;
        this.center = center;
        this.color = color;
        this.offset = oddOrEven ? 0 : TAU / PIKES;
    }

    _createClass(Star, [{
        key: 'getPath',
        value: function getPath() {
            var angle = TAU / PIKES,
                path = new Path2D(),
                pos = this.getPosition(0, 0);

            path.moveTo(pos.x, pos.y);
            for (var i = 1; i < PIKES; i++) {
                pos = this.getPosition(angle * i, i);
                path.lineTo(pos.x, pos.y);
            }
            path.closePath();
            return path;
        }
    }, {
        key: 'getPosition',
        value: function getPosition(angle, index) {
            var distance = index % 2 == 0 ? this.radius : this.radius * PIKE_RATIO;
            return {
                x: this.center.x + Math.floor(Math.cos(this.offset + angle) * distance),
                y: this.center.y + Math.floor(Math.sin(this.offset + angle) * distance)
            };
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            context.strokeStyle = '#' + this.color.toString(16);
            context.stroke(this.getPath());
            this.offset += .001;
        }
    }]);

    return Star;
})();

var Pixel = (function () {
    function Pixel(x, y, color) {
        _classCallCheck(this, Pixel);

        this.x = x;
        this.y = y;
        this.size = Math.floor(PIXEL_SIZE.MAX * Math.random() + PIXEL_SIZE.MIN);
        this.color = '#' + color.toString(16);
        this.direction = [0, 0];
    }

    _createClass(Pixel, [{
        key: 'move',
        value: function move(frameCount) {
            if (frameCount % DIR_CHANGE_FREQ == 0) {
                this.changeDirection();
            }
            this.x += this.direction[0];
            this.y += this.direction[1];
        }
    }, {
        key: 'draw',
        value: function draw(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, TAU, true);
            context.fill();
        }
    }, {
        key: 'changeDirection',
        value: function changeDirection() {
            var dirIndex = Math.floor(Math.random() * DIRECTIONS.length);
            this.direction = DIRECTIONS[dirIndex];
        }
    }]);

    return Pixel;
})();

var Scene = (function () {
    function Scene() {
        _classCallCheck(this, Scene);

        this.stars = [];
        this.pixels = [];
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.origin = {};
        this.frameCount = 0;
        this.resize();
        this.initialize();
    }

    _createClass(Scene, [{
        key: 'resize',
        value: function resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.origin.x = canvas.width / 2;
            this.origin.y = canvas.height / 2;
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this = this;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.fillStyle = '#999';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            /*this.stars.forEach((star)=> {
                star.draw(this.context);
            });*/
            this.pixels.forEach(function (pixel) {
                pixel.move(_this.frameCount);
                pixel.draw(_this.context);
            });
            this.frameCount++;

            requestAnimationFrame(function () {
                _this.draw();
            });
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            var _this2 = this;

            this.context.globalCompositeOperation = 'overlay';
            var starSize = this.canvas.width / 2 / STARS;
            for (var i = 1; i <= STARS; i++) {
                this.stars.push(new Star(starSize * (i + 1), this.origin, COLORS[STARS - i], i % 2 == 0));
            }
            var INTERVAL = PIXEL_SIZE.MIN + PIXEL_SIZE.MAX;

            var _loop = function _loop(_x) {
                _x += INTERVAL;

                var _loop2 = function _loop2(_y) {
                    var notPlaced = true;
                    _this2.stars.forEach(function (star) {
                        if (_this2.context.isPointInPath(star.getPath(), _x, _y) && notPlaced) {
                            _this2.pixels.push(new Pixel(_x, _y, star.color));
                            notPlaced = false;
                        }
                    });
                    _y += INTERVAL;
                    y = _y;
                };

                for (var y = 0; y < _this2.canvas.height;) {
                    _loop2(y);
                }
                x = _x;
            };

            for (var x = 0; x < this.canvas.width;) {
                _loop(x);
            }
        }
    }]);

    return Scene;
})();

document.addEventListener('DOMContentLoaded', function (evt) {
    window.scene = new Scene();
    scene.initialize();
    scene.draw();
});
window.addEventListener('resize', function () {
    window.scene.resize();
});