const
    TAU = Math.PI * 2,
    DEVIATION_SPEED = TAU / 1024,
    DRAWING_SPEED = 0.3,
    TRUNK_MIN_LIFE = 80,
    TRUNK_MAX_LIFE = 120,
    BRANCH_MIN_LIFE = 40,
    BRANCH_MAX_LIFE = 80,
    BRANCHES_PER_SPLIT = 3,
    MAX_LEVEL = 3,
    INITIAL_POINTS = 3,
    MAX_POINTS = 120,
    LIFE_DECAY = 0.1,
    colors = {
        bleu: 'rgb(39,98,141)',
        auLait: 'rgb(205,192,129)',
        caramel: 'rgb(162,120,69)',
        santaFe: 'rgb(120,52,2)',
        candle: 'rgb(231,255,230)'
    },
    points = [],
    leaves = [];

class GrowingPoint {
    constructor(level, x, y, a) {
        this.level = level || 0;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.direction = a || TAU * Math.random();
        this.deviation = ((Math.random() > .5) ? -1 : 1) * (Math.random() * DEVIATION_SPEED);
        if(this.level){
            this.life =
                Math.random() * (BRANCH_MAX_LIFE - BRANCH_MIN_LIFE) + BRANCH_MIN_LIFE;

        }else{
            this.life =
                Math.random() * (TRUNK_MAX_LIFE - TRUNK_MIN_LIFE) + TRUNK_MIN_LIFE;
        }
        this.dead=false;
    }

    //draw the line
    draw(context) {
        context.fillStyle = colors.candle;
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, TAU, true);
        context.fill();
        this.grow();
    }

    //move according to direction + deviation
    grow() {
        this.direction = this.direction + this.deviation;
        this.x += Math.cos(this.direction) * DRAWING_SPEED;
        this.y += Math.sin(this.direction) * DRAWING_SPEED;
        this.life -= LIFE_DECAY;
        if (this.life <= 0) {
            this.die();
        }
    }

    //split this current point to
    split() {
        const nextLevel = this.level ++;
        for(let i = 0; i<BRANCHES_PER_SPLIT; i++){
            points.push(
                new GrowingPoint(
                    nextLevel,
                    this.x,
                    this.y,
                    this.direction +(i*TAU/2)
                )
            );
        }
    }

    //when a point dies, if not at max level, it creates a Leaf and remove itself from the points array.
    die() {
        if (this.level < MAX_LEVEL && points.length < MAX_POINTS) {
            this.split();
        }else{
            leaves.push(new Leaf(this.x, this.y, this.direction));
        }
        points.slice(points.indexOf(this), 0);
    }
}

class Leaf {
    constructor(x, y, a) {
        this.x = x;
        this.y = y;
        this.direction = a;
        this.radius = 1;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = colors.candle;
        context.arc(this.x, this.y, this.radius, 0, TAU, true);
        context.fill();
    }

    grow() {
        if (this.radius >= 5) {
            this.die();
        }
        this.radius ++;
    }

    die() {
        leaves.slice(leaves.indexOf(this), 0);
    }
}

class BigLeaf /*extends Leaf */{
    constructor(x, y, a) {
        //super(x, y, a);
    }

    draw(context) {
        //TODO
    }
    die() {

    }
}

class Flower /*extends Leaf */{
    constructor(x, y, a) {
        //super(x, y, a);
    }

    draw(context) {
        //TODO
    }
    die() {

    }
}

class Scene {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
    }

    initialize() {
        for (let i = 0; i < INITIAL_POINTS; i++) {
            points.push(new GrowingPoint());
        }
        this.resize();
        this.animate();
    }

    animate() {
       // this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        points.forEach((point)=>{
            point.grow();
            point.draw(this.context);
        });
        leaves.forEach((leaf)=>{
            leaf.grow();
            leaf.draw(this.context);
        });

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