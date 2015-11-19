const COLORS = [
        0x241E3E,
        0x733260,
        0x3B8688,
        0xB0B489,
        0xEBDDA4],
    DIRECTIONS = [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ],
    TAU = Math.PI * 2,
    STARS = 4,
    PIKES = 12,
    PIKE_RATIO=.4,
    DIR_CHANGE_FREQ = 30,
    PIXEL_SIZE = {MIN: 10, MAX: 20},

    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    origin = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
/**
 * Pointy polygon,
 */
class Star {
    constructor(radius, center, color, oddOrEven) {
        this.radius = radius;
        this.center = center;
        this.color = color;
        this.offset = oddOrEven ? 0 : TAU/ PIKES;
    }

    getPath() {
        let angle = TAU / PIKES,
            path = new Path2D(),
            pos = this.getPosition(0, 0);

        path.moveTo(pos.x, pos.y);
        for (let i = 1; i < PIKES; i++) {
            pos = this.getPosition(angle * i, i);
            path.lineTo(pos.x, pos.y);
        }
        path.closePath();
        return path;
    }

    getPosition(angle, index) {
        const distance = (index % 2 == 0) ? this.radius : this.radius * PIKE_RATIO;
        return {
            x: this.center.x + Math.floor(Math.cos(this.offset + angle) * distance),
            y: this.center.y + Math.floor(Math.sin(this.offset + angle) * distance)
        };
    }

    draw(context) {
        context.strokeStyle = '#' + this.color.toString(16);
        context.stroke(this.getPath());
        this.offset += .001;
    }
}

class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.floor(PIXEL_SIZE.MAX * Math.random() + PIXEL_SIZE.MIN);
        this.color = '#' + color.toString(16);
        this.direction = [0, 0];
    }

    move(frameCount) {
        if (frameCount % DIR_CHANGE_FREQ == 0) {
            this.changeDirection();
        }
        this.x += this.direction[0];
        this.y += this.direction[1];
    }

    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, TAU, true);
        context.fill();
    }

    changeDirection() {
        const dirIndex = Math.floor(Math.random() * DIRECTIONS.length);
        this.direction = DIRECTIONS[dirIndex];
    }
}
class Scene {
    constructor() {
        this.stars = [];
        this.pixels = [];
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.origin = {};
        this.frameCount = 0;
        this.resize();
        this.initialize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.origin.x = canvas.width / 2;
        this.origin.y = canvas.height / 2;
    }

    draw() {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.context.fillStyle = '#999';
        this.context.fillRect(0,0,this.canvas.width, this.canvas.height);
        /*this.stars.forEach((star)=> {
            star.draw(this.context);
        });*/
        this.pixels.forEach((pixel)=> {
            pixel.move(this.frameCount);
            pixel.draw(this.context);
        });
        this.frameCount++;

        requestAnimationFrame(()=>{this.draw()});
    }

    initialize() {
        this.context.globalCompositeOperation = 'overlay';
        const starSize = (this.canvas.width / 2) / STARS;
        for (let i = 1; i <= STARS; i++) {
            this.stars.push(new Star(starSize * (i + 1), this.origin, COLORS[STARS - i], i%2==0))
        }
        const INTERVAL = PIXEL_SIZE.MIN + PIXEL_SIZE.MAX;
        for (let x = 0; x < this.canvas.width;){
            x += INTERVAL;
            for (let y = 0; y < this.canvas.height;){
                let notPlaced = true;
                this.stars.forEach((star)=> {
                    if (this.context.isPointInPath(star.getPath(),x,y) && notPlaced) {
                        this.pixels.push(new Pixel(x, y, star.color));
                        notPlaced = false;
                    }
                });
                y += INTERVAL;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded',
    (evt)=> {
        window.scene = new Scene();
        scene.initialize();
        scene.draw();
    }
);
window.addEventListener('resize', ()=> {
    window.scene.resize();
});