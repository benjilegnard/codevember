
const TAU = Math.PI * 2,
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
let frameCount = 0,
    circlesAdded = 0;

class Circle {
    constructor() {
        this.reset();
    }
    reset() {
        circlesAdded ++;
        this.x = origin.x;
        this.y = origin.y;
        this.radius = 1;
        this.color = (circlesAdded%2==0) ? 'white' : 'black';
        this.angle = initialDirection;
    }
    grow() {
        this.radius += RADIUS_GROW_SPEED;
        this.angle += ROTATION_SPEED;
        this.x += Math.cos(this.angle) * DEVIATION_SPEED;
        this.y += Math.sin(this.angle) * DEVIATION_SPEED;
    }
    draw() {
        context.fillStyle = this.color;
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, TAU, true);
        //context.stroke();
        context.fill();
    }
}

const
    resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        origin.x = canvas.width / 2;
        origin.y = canvas.height / 2;
    },
    animate = () => {
        frameCount++;
        context.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach((circle) => {
            circle.grow();
            circle.draw();
        });

        if (frameCount % NEW_CIRCLE_FREQ == 0) {
            addCircle();
        }
        requestAnimationFrame(animate);
    },
    addCircle = () => {
        if(circles.length > MAX_CIRCLES){
            const diagonal = Math.sqrt(canvas.width^2 * canvas.height^2 );
            circles.filter((circle)=>{
                return (circle.radius > diagonal);
            })[0].reset();
        }else{
            circles.push(new Circle());
        }
        circles.sort((a,b)=>{return b.radius - a.radius;});
    },
    initialize = () => {
        resize();
        addCircle();
        animate();
    };

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);