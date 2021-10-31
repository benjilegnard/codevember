const
    TAU = Math.PI * 2,
    DEVIATION_SPEED = TAU / 180,
    DRAWING_SPEED = 2,
    RADIUS_FREQUENCY = 0.01,
    MAX_RADIUS = 42,
    INITIAL_POINTS = 15,
    points = [];

let frameCount = 0;

class WobblyCircle {
    constructor(level, x, y, a) {
        this.level = level || 0;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.direction = a || TAU * Math.random();

        this.offset = TAU * Math.random();
        this.dirChangeFrequency = Math.floor(Math.random()*120)+20;
        this.deviation = ((Math.random() > .5) ? -1 : 1) * (Math.random() * DEVIATION_SPEED);
    }

    //draw the line
    draw(context) {
        context.beginPath();
        context.strokeStyle = 'black';
        context.arc(this.x, this.y, this.radius+1, 0, TAU, true);
        context.stroke();
        context.strokeStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, TAU, true);
        context.stroke();
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, TAU, true);
        context.stroke();
    }

    //move according to direction + deviation
    grow(frameCount) {
        this.direction = this.direction + this.deviation;
        this.x += Math.cos(this.direction) * DRAWING_SPEED;
        this.y += Math.sin(this.direction) * DRAWING_SPEED;
        this.radius = Math.abs(Math.cos(this.offset + (frameCount * RADIUS_FREQUENCY))) * MAX_RADIUS;
        if(frameCount % this.dirChangeFrequency == 0){
            this.direction = -this.direction;
        }
    }
    collide(canvas){
        if(this.x > canvas.width + this.radius)
            this.x = -this.radius;
        if(this.y > canvas.height + this.radius)
            this.y = -this.radius;
        if(this.x < -this.radius)
            this.x = canvas.width + this.radius;
        if(this.y < -this.radius)
            this.y = canvas.height + this.radius;
    }

}


class Scene {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
    }

    initialize() {
        for (let i = 0; i < INITIAL_POINTS; i++) {
            points.push(new WobblyCircle());
        }
        this.resize();
        this.animate();
    }

    animate() {
        // this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        points.forEach((point)=>{
            point.grow(frameCount);
            point.draw(this.context);
            point.collide(this.canvas);
        });
        frameCount++;
        requestAnimationFrame(()=> {
            this.animate();
        })
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

document.addEventListener(
    'DOMContentLoaded',
    ()=> {
        window.scene = new Scene();
        scene.resize();
        scene.initialize();
    }
);
window.addEventListener(
    'resize',
    ()=> {
        window.scene.resize();
    }
);