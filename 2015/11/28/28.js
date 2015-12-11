'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    GRAVITY = .1,
    MAX_SPEED = 2,
    MAX_PARTICLES = 320,
    COLOR_CYCLE_STEP = 1;

var Particle = (function () {
    function Particle(opts) {
        _classCallCheck(this, Particle);

        this.x = opts.x || canvas.width / 2;
        this.y = opts.y || canvas.height / 2;
        this.radius = opts.r || Math.floor(Math.random() * 10) + 1;
        this.angle = opts.a || Math.random() * TAU;
        this.speed = opts.s || Math.random() * MAX_SPEED;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.colorIndex = 0;
    }

    _createClass(Particle, [{
        key: 'draw',
        value: function draw(context) {
            context.beginPath();
            context.fillStyle = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + this.alpha + ')';
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            context.fill();
        }
    }, {
        key: 'move',
        value: function move() {
            this.vy += GRAVITY;
            this.x += this.vx;
            this.y += this.vy;
        }
    }, {
        key: 'reset',
        value: function reset(x, y) {
            this.x = x;
            this.y = y;
            this.radius = Math.floor(Math.random() * 10) + 1;
            this.angle = Math.random() * TAU;
            this.speed = Math.random() * MAX_SPEED;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.alpha = 1;
            this.colorIndex = 0;
        }
    }, {
        key: 'isAlive',
        value: function isAlive() {
            return this.radius > 0 && this.alpha > 0;
        }
    }, {
        key: 'grow',
        value: function grow() {
            //fade towards next color
            if (this.colorIndex + 1 < this.colors.length) {
                this.colorCycle(this.colorIndex + 1);
            }
            //next color
            if (this.colors[this.colorIndex + 1] === this.color) {
                this.colorIndex++;
            }
        }
    }, {
        key: 'colorCycle',
        value: function colorCycle(toIndex) {
            if (this.hasOwnProperty('color')) {
                for (var rgb in [0, 1, 2]) {
                    if (this.color[rgb] < this.colors[toIndex][rgb]) this.color[rgb] = this.color[rgb] + COLOR_CYCLE_STEP;else if (this.color[rgb] > this.colors[toIndex][rgb]) this.color[rgb] = this.color[rgb] - COLOR_CYCLE_STEP;
                }
            }
        }
    }]);

    return Particle;
})();

var Smoke = (function (_Particle) {
    _inherits(Smoke, _Particle);

    function Smoke(opts) {
        _classCallCheck(this, Smoke);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Smoke).call(this, opts));

        _this.colors = [[64, 64, 64], [0, 0, 0]];
        _this.color = _this.colors[0];
        return _this;
    }

    _createClass(Smoke, [{
        key: 'grow',
        value: function grow() {
            _get(Object.getPrototypeOf(Smoke.prototype), 'grow', this).call(this);
            this.radius += .2;
            this.alpha -= 0.01;
        }
    }, {
        key: 'reset',
        value: function reset(x, y) {
            _get(Object.getPrototypeOf(Smoke.prototype), 'reset', this).call(this, x, y);
        }
    }, {
        key: 'move',
        value: function move() {
            this.vy -= GRAVITY / 2;
            this.x += this.vx;
            this.y += this.vy;
        }
    }]);

    return Smoke;
})(Particle);

var Fire = (function (_Particle2) {
    _inherits(Fire, _Particle2);

    function Fire(opts) {
        _classCallCheck(this, Fire);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Fire).call(this, opts));

        _this2.reset(_this2.x, _this2.y);
        _this2.colors = [[255, 249, 177], [211, 152, 24], [195, 67, 25]];
        _this2.color = _this2.colors[0];
        return _this2;
    }

    _createClass(Fire, [{
        key: 'grow',
        value: function grow() {
            _get(Object.getPrototypeOf(Fire.prototype), 'grow', this).call(this);
            this.radius -= 0.05;
        }
    }, {
        key: 'reset',
        value: function reset(x, y) {
            _get(Object.getPrototypeOf(Fire.prototype), 'reset', this).call(this, x, y);
        }
    }]);

    return Fire;
})(Particle);

var Scene = (function () {
    function Scene() {
        _classCallCheck(this, Scene);

        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.particles = [];
        this.frameCount = 0;
    }

    _createClass(Scene, [{
        key: 'initialize',
        value: function initialize() {
            var _this3 = this;

            this.resize();
            this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };
            for (var i = 0; i < MAX_PARTICLES; i++) {

                if (i % 2) {
                    this.particles.push(new Smoke({}));
                } else {
                    this.particles.push(new Fire({}));
                }
            }
            this.animate();
            this.explode();
            this.canvas.addEventListener('touchmove', function (event) {
                event.touches.forEach(function (touchEvent) {
                    window.scene.mouseMove(touchEvent);
                });
            });
            this.canvas.addEventListener('touchend', function (event) {
                _this3.explode();
            });
            this.canvas.addEventListener('mouseup', function (event) {
                _this3.explode();
            });
            this.canvas.addEventListener('mousemove', function (event) {
                window.scene.mouseMove(event);
            });
        }
    }, {
        key: 'explode',
        value: function explode() {
            var _this4 = this;

            this.particles.forEach(function (p) {
                p.reset(_this4.mouse.x, _this4.mouse.y);
            });
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this5 = this;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            //this.context.fillStyle = 'rgb('+COLORS.BG[0]+','+COLORS.BG[1]+','+COLORS.BG[2]+')';
            //this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

            this.particles.filter(function (particle) {
                return particle.isAlive();
            }).forEach(function (particle) {
                particle.draw(_this5.context);
                particle.grow();
                particle.move(_this5.frameCount);
            });

            requestAnimationFrame(function () {
                _this5.frameCount++;
                _this5.animate();
            });
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }, {
        key: 'mouseMove',
        value: function mouseMove(event) {
            this.mouse.x = event.pageX;
            this.mouse.y = event.pageY;
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
//# sourceMappingURL=28.js.map
