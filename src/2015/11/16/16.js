const
    TAU = Math.PI * 2,
    ROTATION_SPEED = TAU / 180,
    CIRCLES_PER_SPIRAL = 24,
    GROW_SPEED = 1,
    MAX_SPIRALS = 3,
    ALPHA_DECAY = 0.00025,
    RESET_DELAY = 360,
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    spirals = [],
    initialDirection = TAU * Math.random(),
    origin = {
        x: canvas.width / 2,
        y: canvas.height / 2
    },
    mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };

let
    frameCount = 0,
    circlesAdded = 0;

class Spiral {
    constructor() {
        this.circles = [];
        this.init();
        this.reset();
    }
    reset() {
        this.life = 0.2;

        this.x = origin.x;
        this.y = origin.y;
        this.radius = 1;
        for (let i = 0; i < CIRCLES_PER_SPIRAL; i++) {
            this.circles[i].radius = this.radius/2;
            // this.circles[i].angle =  i * (TAU / CIRCLES_PER_SPIRAL);
        }
    }
    init() {
        for (let i = 0; i < CIRCLES_PER_SPIRAL; i++) {
            this.circles.push(new Circle({
                angle: i * (TAU / CIRCLES_PER_SPIRAL),
                spiral: this,
                color: (i % 2 == 0)
            }));
        }
    }
    draw() {
        this.circles.forEach((c) => {
            c.draw()
        });
    }
    move() {
        this.radius += GROW_SPEED;
        this.life -= ALPHA_DECAY;
        this.x += Math.cos(initialDirection);
        this.y += Math.sin(initialDirection);
        this.circles.forEach((c) => {
            c.move()
        });
    }
}

class Circle {
    constructor(props) {
        this.spiral = props.spiral;
        this.color = props.color;
        this.angle = props.angle;
        this.radius = this.spiral.radius / 3;

        this.x = this.spiral.x + Math.cos(this.angle) * this.radius;
        this.y = this.spiral.y + Math.sin(this.angle) * this.radius;

    }
    move() {
        this.radius += GROW_SPEED;
        this.angle -= ROTATION_SPEED;
        this.x = this.spiral.x + Math.cos(this.angle) * this.radius;
        this.y = this.spiral.y + Math.sin(this.angle) * this.radius;
    }
    draw() {
        context.fillStyle = this.color ? 'rgb(0,0,0)' : 'rgba(255,255,255)';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, TAU, true);
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
        //Add new spiral
        if(frameCount%RESET_DELAY==0){
            if(spirals.length < MAX_SPIRALS){

                spirals.push(
                    new Spiral()
                );
            }
        }
        frameCount++;
        //rest
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'xor';
        spirals.forEach((spiral) => {
            spiral.move();
            spiral.draw();
        });

        //reset transparent spiral
        spirals
            .filter((s)=>{return s.life <=0})
            .forEach((s)=>{s.reset();});

        requestAnimationFrame(animate);
    },
    initialize = () => {
        resize();
        animate();
    };

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);