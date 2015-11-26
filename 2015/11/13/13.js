'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAU = Math.PI * 2,
    LINE_QUANTITY = 3,
    MAX_TREE_LEVEL = 3,
    MAX_CHILDREN = 10,
    MAX_START_RADIUS = window.innerWidth / 3,
    LINE_COLOR = 'rgba(0,0,0,0.6)',
    LINE_WIDTH = .25,
    ROTATION_SPEED = TAU / 360,
    MAX_SPEED = 4,
    canvas = document.getElementById('c'),
    context = canvas.getContext('2d'),
    lines = [];
var frameCount = 0;

var RotTreeLine = (function () {
    function RotTreeLine(props) {
        _classCallCheck(this, RotTreeLine);

        this.parent = props.parent || { x: props.x, y: props.y, level: 0 };
        this.direction = Math.random() * TAU; //only root points are moving
        this.radius = props.radius;
        this.angle = props.angle || Math.random() * TAU;
        this.x = this.parent.x + Math.cos(this.angle) * this.radius;
        this.y = this.parent.y + Math.sin(this.angle) * this.radius;
        this.children = [];
        this.level = this.parent.level + 1;
        this.speed = Math.random() * MAX_SPEED;
        this.birth();
    }

    _createClass(RotTreeLine, [{
        key: 'birth',
        value: function birth() {
            if (this.level < MAX_TREE_LEVEL) {
                var maxChild = Math.random() * 5;
                for (var i = 0; i < maxChild; i++) {
                    this.children.push(new RotTreeLine({
                        parent: this,
                        radius: this.radius * .75
                    }));
                }
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            context.lineWidth = LINE_WIDTH;
            context.strokeStyle = LINE_COLOR;

            context.beginPath();
            context.moveTo(this.parent.x, this.parent.y);
            context.lineTo(this.x, this.y);
            context.closePath();
            context.stroke();
            this.children.forEach(function (line) {
                line.draw();
            });
        }
    }, {
        key: 'move',
        value: function move() {
            this.angle = this.angle + ROTATION_SPEED * this.speed;
            this.x = this.parent.x + Math.cos(this.angle) * this.radius;
            this.y = this.parent.y + Math.sin(this.angle) * this.radius;
            if (this.level == 1) {
                this.direction += -0.003;
                this.parent.x += Math.cos(this.direction);
                this.parent.y += Math.sin(this.direction);
            }
            this.children.forEach(function (line) {
                line.move();
            });
        }
    }]);

    return RotTreeLine;
})();

var resize = function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
},
    collision = function collision(line) {
    if (line.parent.x < 0 || line.parent.x > window.innerWidth) {
        line.direction = TAU / 2 - line.direction;
    }
    if (line.parent.y < 0 || line.parent.y > window.innerHeight) {
        line.direction = -line.direction;
    }
},
    animate = function animate() {
    if (frameCount % 20 == 0) {
        context.fillStyle = 'rgba(211,211,211,0.1)';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    frameCount++;
    lines.forEach(function (line) {
        line.move();
    });
    lines.forEach(function (line) {
        line.draw();
    });
    lines.forEach(collision);
    requestAnimationFrame(animate);
},
    initialize = function initialize() {
    resize();
    for (var i = 0; i < LINE_QUANTITY; i++) {
        lines.push(new RotTreeLine({
            angle: TAU / LINE_QUANTITY * i,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: (Math.random() + .5) * MAX_START_RADIUS
        }));
        lines[i].move();
    }
    animate();
};

window.addEventListener('resize', resize, false);
document.addEventListener('DOMContentLoaded', initialize);
//# sourceMappingURL=13.js.map
