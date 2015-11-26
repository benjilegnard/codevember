'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BASE_WIDTH = 40;
var DRAW_SPEED = 0.5;
var CYCLES_PER_FRAME = 3;
var WIDTH_DIM_SPEED = 0.01;
var MIN_BRANCH_LENGTH = 120;
var MAX_BRANCH_LENGTH = 360;
var MAX_BRANCHES_PER_SPLIT = 4;
var TREE_COLOR = { r: 0, g: 0, b: 0 };
var BACK_COLOR = { r: 255, g: 255, b: 255 };
var TAU = Math.PI * 2;
var BRANCH_MAX_ANGLE = TAU / 7;

var canvas = document.getElementById('c');
var context = canvas.getContext('2d');
var generators = [];

var BranchGenerator = (function () {
    function BranchGenerator(opts) {
        _classCallCheck(this, BranchGenerator);

        //current pos
        this.position = {
            x: opts.x,
            y: opts.y
        };
        //Radiant angle
        this.direction = opts.a;
        //width of the branch
        this.width = opts.w || BASE_WIDTH;
        this.life = 0;
        this.length = Math.random() * (MAX_BRANCH_LENGTH - MIN_BRANCH_LENGTH) + MIN_BRANCH_LENGTH;
        this.level = opts.l || 1;
    }

    _createClass(BranchGenerator, [{
        key: 'evolve',
        value: function evolve() {
            //increment position in given direction
            //reduce width
            this.position.x += Math.cos(this.direction) * DRAW_SPEED;
            this.position.y += Math.sin(this.direction) * DRAW_SPEED;
            this.life++;
            this.width -= WIDTH_DIM_SPEED * this.level;
        }
    }, {
        key: 'getTangentPoint',
        value: function getTangentPoint(a) {
            return {
                x: this.position.x + Math.cos(a) * this.width / 2,
                y: this.position.y + Math.sin(a) * this.width / 2
            };
        }
    }, {
        key: 'draw',
        value: function draw() {
            var start = this.getTangentPoint(this.direction + TAU / 4);
            var end = this.getTangentPoint(this.direction - TAU / 4);
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.closePath();
            context.stroke();
        }
    }, {
        key: 'split',
        value: function split() {
            //Create new generators
            var branchesNumber = Math.floor(Math.random() * MAX_BRANCHES_PER_SPLIT);
            if (branchesNumber == 0) {
                branchesNumber = 1;
            }
            var angle = 0;
            for (var i = 0; i < branchesNumber; i++) {
                angle = BRANCH_MAX_ANGLE * i - Math.random() * BRANCH_MAX_ANGLE, generators.push(new BranchGenerator({
                    //sets the position a little
                    x: this.position.x - Math.cos(this.direction) * this.width / 3,
                    y: this.position.y - Math.sin(this.direction) * this.width / 3,
                    a: this.direction + angle,
                    w: this.width,
                    l: this.level + 1
                }));
            }
            generators.splice(generators.indexOf(this), 1);
        }
    }]);

    return BranchGenerator;
})();

var cleanUp = function cleanUp() {
    generators.forEach(function (g) {
        if (g.width <= 0) {
            generators.splice(generators.indexOf(g), 1);
        }
    });
},
    addGenerator = function addGenerator(e) {
    //fade previous trees
    if (!generators.length) {
        context.fillStyle = 'rgba(' + BACK_COLOR.r + ',' + BACK_COLOR.g + ',' + BACK_COLOR.b + ',0.25)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.fillStyle = 'rgb(' + TREE_COLOR.r + ',' + TREE_COLOR.g + ',' + TREE_COLOR.b + ')';
    //new tree gen
    generators.push(new BranchGenerator({ x: e.x, y: canvas.height, a: -TAU / 4 }));
},
    touch = function touch(e) {
    var x = undefined,
        y = undefined;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = e.touches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            t = _step.value;

            x = t.clientX;
            y = t.clientY;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    addGenerator({ x: x, y: y });
},
    click = function click(e) {
    console.log(e);
    addGenerator({ x: e.clientX, y: e.clientY });
},
    animate = function animate(t) {

    generators.forEach(function (g) {
        for (var i = 0; i < CYCLES_PER_FRAME; i++) {
            g.draw();
            g.evolve();
            if (g.life > g.length) {
                g.split();
            }
        }
    });
    cleanUp();
    if (!generators.length) {
        addGenerator({ x: Math.random() * canvas.width, y: canvas.height });
    }
    requestAnimationFrame(animate);
},
    resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},
    init = function init() {
    resize();
    addGenerator({ x: canvas.width / 2, y: canvas.height });
    animate();
},
    reset = function reset(e) {
    e.stopPropagation();
    context.clearRect(0, 0, canvas.width, canvas.height);
    return false;
};
document.addEventListener('touch', touch);
document.addEventListener('click', click);
window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', init);
//# sourceMappingURL=06.js.map
