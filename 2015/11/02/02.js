'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//play with these values :
var
//number of abstract circles on the scene. (minimum 2)
CIRCLE_AMOUNT = 4,

//radius of each circle
CIRCLE_RADIUS = 160,

//number of points on a circle (avoid more than 360)
PRECISION = 180,

//don't touch below, those are real constants :)
TAU = Math.PI * 2,
    ANGLE = TAU / PRECISION;

var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};
/**
 * a Circle abstraction,
 */

var Circle = (function () {
    /**
     * takes an object as argument
     * ex :
     *  {
        radius:100,
        center:{x:100,y:200},
        clockwise:true
      }
     */

    function Circle(options) {
        _classCallCheck(this, Circle);

        this.radius = options.radius;
        this.center = options.center;
        this.points = [];
        this.currentPoint = options.offest || 0;
        this.currentAngle = options.offest * ANGLE || 0;
        //clockwise or not, defines the orientation in wich to fetch the next point
        this.clockwise = options.clockwise;
    }
    /**
     * calculate the next point coordinates, and inc/decrement angle.
     */

    _createClass(Circle, [{
        key: 'nextPoint',
        value: function nextPoint() {
            if (this.clockwise) {
                this.currentAngle += ANGLE;
            } else {
                this.currentAngle -= ANGLE;
            }
            return {
                x: this.center.x + Math.cos(this.currentAngle) * CIRCLE_RADIUS,
                y: this.center.y + Math.sin(this.currentAngle) * CIRCLE_RADIUS
            };
        }
    }]);

    return Circle;
})();

/**
 * Draws a line between a point of each circle on the scene.
 */

var PolyLine = (function () {
    function PolyLine(circles) {
        _classCallCheck(this, PolyLine);

        this.circles = circles;
        this.points = [];
        this.tick();
    }
    /**
     * gets the next point of each circle to draw.
     */

    _createClass(PolyLine, [{
        key: 'tick',
        value: function tick() {
            var _this = this;

            var i = 0;
            this.circles.forEach(function (circle) {
                _this.points[i] = circle.nextPoint();
                i++;
            });
        }
        /**
         * connect each circle with a white line.
         */

    }, {
        key: 'draw',
        value: function draw() {
            context.beginPath();
            context.strokeStyle = 'white';
            context.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 1; i < this.points.length; i += 1) {
                context.lineTo(this.points[i].x, this.points[i].y);
            }
            //end
            context.lineTo(this.points[0].x, this.points[0].y);
            context.stroke();
        }
    }]);

    return PolyLine;
})();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };
}
var circles = [],
    polyline = null,
    frameCount = 0;

function initialize() {
    resize();
    for (var i = 0; i < CIRCLE_AMOUNT; i++) {
        circles.push(new Circle({
            radius: CIRCLE_RADIUS,
            center: {
                x: center.x + Math.cos(TAU / CIRCLE_AMOUNT * i) * CIRCLE_RADIUS,
                y: center.y + Math.sin(TAU / CIRCLE_AMOUNT * i) * CIRCLE_RADIUS
            },
            offset: -((i + 1) / CIRCLE_AMOUNT) * 360 * PRECISION,
            clockwise: i % 2 == 0
        }));
    }
    polyline = new PolyLine(circles);
    animate();
}

function animate(timestamp) {
    //simulates fading of old lines.
    context.fillStyle = 'rgba(0,0,0,' + 13.5 / PRECISION + ')';
    context.fillRect(0, 0, canvas.width, canvas.height);
    //Draw
    //circles.forEach((c)=>{c.draw()});
    polyline.draw();
    //if(frameCount%5 == 0){
    //context.clearRect(0, 0, canvas.width, canvas.height);
    polyline.tick();
    //}
    //frameCount++;
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);
//# sourceMappingURL=02.js.map
