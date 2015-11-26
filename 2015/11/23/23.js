'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    DEVIATION_SPEED = TAU / 1024,
    DRAWING_SPEED = 0.5,
    TRUNK_MIN_LIFE = 100,
    TRUNK_MAX_LIFE = 120,
    BRANCH_MIN_LIFE = 80,
    BRANCH_MAX_LIFE = 100,
    BRANCHES_PER_SPLIT = 4,
    MAX_LEVEL = 5,
    INITIAL_POINTS = 5,
    LIFE_DECAY = 0.3,
    colors = {
    bleu: 'rgb(39,98,141)',
    auLait: 'rgb(205,192,129)',
    caramel: 'rgb(162,120,69)',
    santaFe: 'rgb(120,52,2)',
    candle: 'rgb(231,255,230)'
},
    points = [],
    leaves = [];

var GrowingPoint = (function () {
    function GrowingPoint(level, x, y, a, life, deviation) {
        _classCallCheck(this, GrowingPoint);

        this.level = level || 0;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.direction = a || TAU * Math.random();
        this.life = life || this.randomLife();
        this.deviation = deviation || (Math.random() > .5 ? -1 : 1) * (Math.random() * DEVIATION_SPEED);

        this.dead = false;
    }

    _createClass(GrowingPoint, [{
        key: 'randomLife',
        value: function randomLife() {
            if (this.level < 1) {
                return Math.random() * (BRANCH_MAX_LIFE - BRANCH_MIN_LIFE) + BRANCH_MIN_LIFE;
            } else {
                return Math.random() * (TRUNK_MAX_LIFE - TRUNK_MIN_LIFE) + TRUNK_MIN_LIFE;
            }
        }
        //draw the line

    }, {
        key: 'draw',
        value: function draw(context) {
            context.fillStyle = colors.candle;
            context.beginPath();
            context.arc(this.x, this.y, 2, 0, TAU, true);
            context.fill();
        }

        //move according to direction + deviation

    }, {
        key: 'grow',
        value: function grow() {
            this.direction = this.direction + this.deviation;
            this.x += Math.cos(this.direction) * DRAWING_SPEED;
            this.y += Math.sin(this.direction) * DRAWING_SPEED;
            this.life -= LIFE_DECAY;
            if (this.life <= 0) {
                this.die();
            }
        }

        //split this current point to

    }, {
        key: 'split',
        value: function split() {
            var nextLevel = this.level + 1,
                branchesForThisSplit = Math.floor(Math.random() * BRANCHES_PER_SPLIT + 1);
            if (nextLevel < MAX_LEVEL) {
                for (var i = 0; i < branchesForThisSplit; i++) {
                    points.push(new GrowingPoint(nextLevel, this.x, this.y, this.direction + (i * (TAU / 2) / branchesForThisSplit - TAU / 2 / branchesForThisSplit) * (Math.random() > .5 ? -1 : 1)));
                }
            }
        }

        //when a point dies, it creates a Leaf and remove itself from the points array.

    }, {
        key: 'die',
        value: function die() {
            this.dead = true;
            //remove from points drawn
            points.splice(points.indexOf(this), 1);
            //chance to generate a leaf and not children points
            var leafOrSplit = Math.random() > 0.3;
            console.log(leafOrSplit);
            if (this.level < MAX_LEVEL && leafOrSplit) {
                this.split();
            } else {
                var leaf = undefined;
                if (this.level < 2) {
                    leaf = new Leaf(this.x, this.y, this.direction);
                } else {
                    if (Math.random() > .5) {
                        leaf = new BigLeaf(this.x, this.y, this.direction);
                    } else {
                        leaf = new Flower(this.x, this.y, this.direction);
                    }
                }
                leaves.push(leaf);
            }
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

    return GrowingPoint;
})();

var Leaf = (function () {
    function Leaf(x, y, a) {
        _classCallCheck(this, Leaf);

        this.x = x;
        this.y = y;
        this.direction = a;
        this.radius = 1;
    }

    _createClass(Leaf, [{
        key: 'draw',
        value: function draw(context) {
            context.beginPath();
            context.fillStyle = colors.candle;
            context.arc(this.x, this.y, this.radius, 0, TAU, true);
            context.fill();
        }
    }, {
        key: 'grow',
        value: function grow() {
            if (this.radius >= 5) {
                this.die();
            }
            this.radius++;
        }
    }, {
        key: 'die',
        value: function die() {
            leaves.splice(leaves.indexOf(this), 1);
        }
    }]);

    return Leaf;
})();

var BigLeaf = (function (_Leaf) {
    _inherits(BigLeaf, _Leaf);

    function BigLeaf(x, y, a) {
        _classCallCheck(this, BigLeaf);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BigLeaf).call(this, x, y, a));

        _this.x = x;
        _this.y = y;
        _this.direction = a;
        _this.length = 20;
        return _this;
    }

    _createClass(BigLeaf, [{
        key: 'draw',
        value: function draw(context) {
            context.beginPath();
            context.fillStyle = colors.santaFe;
            context.strokeStyle = colors.candle;
            context.lineWidth = 5;
            context.arc(this.x, this.y, this.length, 0, TAU, true);
            context.fill();
            context.fill();
        }
    }, {
        key: 'drawLeftLeaf',
        value: function drawLeftLeaf(context) {}
    }, {
        key: 'die',
        value: function die() {
            _get(Object.getPrototypeOf(BigLeaf.prototype), 'die', this).call(this);
        }
    }]);

    return BigLeaf;
})(Leaf);

var Flower = (function (_Leaf2) {
    _inherits(Flower, _Leaf2);

    function Flower(x, y, a) {
        _classCallCheck(this, Flower);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Flower).call(this, x, y, a));

        _this2.length = 20;
        return _this2;
    }

    _createClass(Flower, [{
        key: 'draw',
        value: function draw(context) {
            context.beginPath();
            context.fillStyle = colors.santaFe;
            context.arc(this.x, this.y, this.length, 0, TAU, true);
            context.fill();
        }
    }, {
        key: 'die',
        value: function die() {
            _get(Object.getPrototypeOf(Flower.prototype), 'die', this).call(this);
        }
    }]);

    return Flower;
})(Leaf);

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
                points.push(new GrowingPoint());
            }
            this.resize();
            this.animate();
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this3 = this;

            // this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            points.forEach(function (point) {
                point.grow();
                point.collide(_this3.canvas);
                point.draw(_this3.context);
            });
            leaves.forEach(function (leaf) {
                leaf.grow();
                leaf.draw(_this3.context);
            });

            requestAnimationFrame(function () {
                _this3.animate();
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
//# sourceMappingURL=23.js.map
