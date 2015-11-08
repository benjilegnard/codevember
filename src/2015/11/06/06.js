const BASE_WIDTH = 40;
const DRAW_SPEED = 0.5;
const CYCLES_PER_FRAME = 3;
const WIDTH_DIM_SPEED = 0.01;
const MIN_BRANCH_LENGTH = 120;
const MAX_BRANCH_LENGTH = 360;
const MAX_BRANCHES_PER_SPLIT = 4;
const TREE_COLOR = {r: 0, g: 0, b: 0};
const BACK_COLOR = {r: 255, g: 255, b: 255};
const TAU = Math.PI * 2;
const BRANCH_MAX_ANGLE = TAU / 7;

const canvas = document.getElementById('c');
const context = canvas.getContext('2d');
const generators = [];

class BranchGenerator {
    constructor(opts) {
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

    evolve() {
        //increment position in given direction
        //reduce width
        this.position.x += Math.cos(this.direction) * DRAW_SPEED;
        this.position.y += Math.sin(this.direction) * DRAW_SPEED;
        this.life++;
        this.width -= WIDTH_DIM_SPEED * this.level;
    }

    getTangentPoint(a) {
        return {
            x: this.position.x + Math.cos(a) * this.width / 2,
            y: this.position.y + Math.sin(a) * this.width / 2
        };
    }

    draw() {
        const start = this.getTangentPoint(this.direction + TAU / 4);
        const end = this.getTangentPoint(this.direction - TAU / 4);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();
    }

    split() {
        //Create new generators
        let branchesNumber = Math.floor(Math.random() * MAX_BRANCHES_PER_SPLIT);
        if (branchesNumber == 0) {
            branchesNumber = 1;
        }
        let angle = 0;
        for (let i = 0; i < branchesNumber; i++) {
            angle = BRANCH_MAX_ANGLE * i - Math.random() * BRANCH_MAX_ANGLE,
                generators.push(new BranchGenerator(
                    {
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
}

let
    cleanUp = ()=> {
        generators.forEach((g)=> {
            if (g.width <= 0) {
                generators.splice(generators.indexOf(g), 1);
            }
        });
    },
    addGenerator = (e) => {
        //fade previous trees
        if (!generators.length) {
            context.fillStyle = `rgba(${BACK_COLOR.r},${BACK_COLOR.g},${BACK_COLOR.b},0.25)`;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        context.fillStyle = `rgb(${TREE_COLOR.r},${TREE_COLOR.g},${TREE_COLOR.b})`;
        //new tree gen
        generators.push(new BranchGenerator({x: e.x, y: canvas.height, a: -TAU / 4}))
    },
    touch = (e)=> {
        let x, y;
        for (t of e.touches) {
            x = t.clientX;
            y = t.clientY;
        }
        addGenerator({x: x, y: y});
    },
    click = (e) => {
        console.log(e);
        addGenerator({x: e.clientX, y: e.clientY});
    },
    animate = (t) => {

        generators.forEach((g)=> {
            for (let i = 0; i < CYCLES_PER_FRAME; i++) {
                g.draw();
                g.evolve();
                if (g.life > g.length) {
                    g.split();
                }
            }
        });
        cleanUp();
        if (!generators.length) {
            addGenerator({x: Math.random() * canvas.width, y: canvas.height});
        }
        requestAnimationFrame(animate);
    },
    resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    init = () => {
        resize();
        addGenerator({x: canvas.width / 2, y: canvas.height});
        animate();
    },
    reset = (e) => {
        e.stopPropagation();
        context.clearRect(0, 0, canvas.width, canvas.height);
        return false;
    };
document.addEventListener('touch', touch);
document.addEventListener('click', click);
window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', init);
