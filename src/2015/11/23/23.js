const
    TAU = Math.PI * 2,
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

class GrowingPoint {
    constructor(level, x, y, a, life, deviation) {
        this.level = level || 0;
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.direction = a || TAU * Math.random();
        this.life = life || this.randomLife();
        this.deviation = deviation || ((Math.random() > .5) ? -1 : 1) * (Math.random() * DEVIATION_SPEED);

        this.dead=false;
    }
    randomLife(){
        if(this.level <1){
            return Math.random() * (BRANCH_MAX_LIFE - BRANCH_MIN_LIFE) + BRANCH_MIN_LIFE;

        }else{
            return Math.random() * (TRUNK_MAX_LIFE - TRUNK_MIN_LIFE) + TRUNK_MIN_LIFE;
        }
    }
    //draw the line
    draw(context) {
        context.fillStyle = colors.candle;
        context.beginPath();
        context.arc(this.x, this.y, 2, 0, TAU, true);
        context.fill();
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
        const nextLevel = this.level + 1,
            branchesForThisSplit = Math.floor(Math.random() * BRANCHES_PER_SPLIT + 1);
        if (nextLevel < MAX_LEVEL){
            for(let i = 0; i<branchesForThisSplit; i++){
                points.push(
                    new GrowingPoint(
                        nextLevel,
                        this.x,
                        this.y,
                        this.direction + (i*(TAU/2)/branchesForThisSplit -(TAU/2)/branchesForThisSplit) * (Math.random()>.5 ? -1 : 1)
                    )
                );
            }
        }
    }

    //when a point dies, it creates a Leaf and remove itself from the points array.
    die() {
        this.dead = true;
        //remove from points drawn
        points.splice(points.indexOf(this), 1);
        //chance to generate a leaf and not children points
        const leafOrSplit = (Math.random() > 0.3);
        console.log(leafOrSplit);
        if (this.level < MAX_LEVEL && leafOrSplit){
            this.split();
        }else{
            let leaf;
            if(this.level<2){
                leaf = new Leaf(this.x, this.y, this.direction);
            }else{
                if(Math.random()>.5){
                    leaf = new BigLeaf(this.x, this.y, this.direction)
                }else{
                    leaf = new Flower(this.x, this.y, this.direction)
                }
            }
            leaves.push(leaf);
        }
    }
    collide(canvas){
        if(this.x > canvas.width )
            this.x = 0;
        if(this.y > canvas.height)
            this.y = 0;
        if(this.x < 0)
            this.x = canvas.width ;
        if(this.y < 0)
            this.y = canvas.height;
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
        leaves.splice(leaves.indexOf(this), 1);
    }
}

class BigLeaf extends Leaf {
    constructor(x, y, a) {
        super(x,y,a);
        this.x = x;
        this.y = y;
        this.direction = a;
        this.length = 20;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = colors.santaFe;
        context.strokeStyle = colors.candle;
        context.lineWidth = 5;
        context.arc(this.x, this.y, this.length, 0, TAU, true);
        context.fill();
        context.fill();
    }
    drawLeftLeaf(context){

    }
    die() {
        super.die();
    }
}

class Flower extends Leaf {
    constructor(x, y, a) {
        super(x,y,a);
        this.length = 20;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = colors.santaFe;
        context.arc(this.x, this.y, this.length, 0, TAU, true);
        context.fill();
    }
    die() {
        super.die();
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
            point.collide(this.canvas);
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