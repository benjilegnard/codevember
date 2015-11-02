'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var COLORS = {
    white: 0xFFFFFF,
    pastelBlue: 0xC9E6FF
},
    TAU = Math.PI * 2,
    FLAKE_BRANCHES = 3,
    FLAKE_ROOTS = 6,
    FLAKE_LENGTH = 4,
    FALL_VARIATION = TAU / 12,
    FALL_SPEED = 1,
    TREE_MAX_HEIGHT = window.innerHeight,
    context = document.getElementById('snowflakes');

var Snowflake = (function () {
    function Snowflake(props) {
        _classCallCheck(this, Snowflake);

        this.position = {};
        this.position.x = props.x;
        this.position.y = props.y;
        this.position.z = props.z;
        this.radius = FLAKE_LENGTH / 1;
        this.rotation = props.rotation;
        this.direction = -TAU / 4 + Math.random() * FALL_VARIATION;
    }

    _createClass(Snowflake, [{
        key: 'move',
        value: function move(frameCount) {
            this.direction = Math.sin(frameCount) * FALL_VARIATION;
            this.position.x += Math.cos(this.direction) * FALL_SPEED;
            this.position.y += Math.sin(this.direction) * FALL_SPEED;
        }
    }, {
        key: 'draw',
        value: function draw() {
            context.strokeStyle = 'white';
            var branchDirection = this.direction;
            for (var i = 0; i < FLAKE_ROOTS; i++) {
                context.beginPath();
                context.moveTo(this.position.x, this.position.y);
                context.lineTo(this.position.x + Math.cos(branchDirection) * this.radius, this.position.y + Math.sin(branchDirection) * this.radius);
                context.stroke();
                branchDirection += TAU / FLAKE_ROOTS;
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            if (this.y > canvas.height) {
                this.y = 0 - this.radius;
            }
        }
    }]);

    return Snowflake;
})();

var Tree = (function () {
    function Tree(props) {
        _classCallCheck(this, Tree);

        this.x = props.x;
        this.y = props.y;
        this.z = props.z;
        this.color = '#98CDDB';
    }

    _createClass(Tree, [{
        key: 'reset',
        value: function reset(x, y, z) {}
    }, {
        key: 'draw',
        value: function draw() {
            context.moveTo(this.x, this.y - this.z * .5);
            context.lineTo();
        }
    }, {
        key: 'fall',
        value: function fall() {}
    }]);

    return Tree;
})();

var Scene = function Scene() {
    _classCallCheck(this, Scene);
};
//# sourceMappingURL=24.js.map
