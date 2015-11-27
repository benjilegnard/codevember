const
    COLORS = {
        RAY: [84, 196, 236],
        BG: [52, 52, 54]
    },
    TAU = Math.PI * 2,
    SPACE_BETWEEN_CIRCLES = 20,
    CIRCLES_QUANTITY = 36,
    CIRCLES_WIDTH = 10,
    SPREAD_ANGLE = TAU / 6,
    SPREAD_FREQUENCY = 2,
    DRAW_LINE = false,
    DRAW_ARC = true;

class Circle {

    constructor(radar, radius, alpha) {
        this.radar = radar;
        this.radius = radius;
        this.alpha = alpha || 1;
    }

    move(alpha) {
        this.alpha = alpha;
    }

    draw(context) {
        if(DRAW_ARC) {
            context.beginPath();
            context.lineWidth = CIRCLES_WIDTH;
            context.strokeStyle = 'rgba('+COLORS.RAY[0]+','+COLORS.RAY[1]+','+COLORS.RAY[2]+','+this.alpha+')';
            context.arc(
                this.radar.center.x, this.radar.center.y,
                this.radius,
                this.radar.direction + SPREAD_ANGLE / 2,
                this.radar.direction - SPREAD_ANGLE / 2,
                true);
            context.stroke();
        }
    }
}

class Radar {

    constructor() {
        this.circles = [];
        this.center = {x:0,y:0};
        this.initialRadius = 30;
        this.currentCircleIndex = 0;
        this.direction = 0;
        for(let i = 0; i< CIRCLES_QUANTITY; i++){
            this.circles.push(new Circle(this, this.initialRadius + i * SPACE_BETWEEN_CIRCLES))
        }
        this.mousePosition = {
            x : canvas.width,
            y : canvas.height/2
        }
    }

    resize(canvas) {

        //this.maxRadius = Math.min(canvas.width,canvas.height) / 2;
        this.center = {
            x: canvas.width / 2,
            y : canvas.height/2
        }
    }

    move(frameCount) {
        this.direction = Math.atan2(this.mousePosition.y - this.center.y, this.mousePosition.x - this.center.x);

        for(let i = 0; i < this.circles.length; i++){

            //const alpha = 1 - Math.abs(this.currentCircleIndex - i) / this.circles.length;
            const alpha = (i<this.currentCircleIndex) ? ( i / this.currentCircleIndex ) : 0;
            this.circles[i].move(alpha);
        }
        //next circle will be high alpha.
        if(frameCount % SPREAD_FREQUENCY == 0){
            this.incrementIndex();
        }

    }

    draw(context) {
        this.circles.forEach(
            (circle)=>{
                circle.draw(context);
            }
        );
        if(DRAW_LINE) {
            context.beginPath();
            context.moveTo(this.center.x, this.center.y);
            context.lineTo(this.mousePosition.x, this.mousePosition.y);
            context.stroke();
        }
    }
    incrementIndex(){
        if(this.currentCircleIndex < this.circles.length){
            this.currentCircleIndex ++;
        }else{
            this.currentCircleIndex = 0;
        }
    }
}

class Scene {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.frameCount = 0;
    }

    initialize() {
        this.radar = new Radar();
        this.resize();
        this.animate();
        this.canvas.addEventListener(
            'touchmove',
            (event)=> {
                event.touches.forEach((touchEvent)=>{
                    window.scene.mouseMove(touchEvent);
                });
            }
        );
        this.canvas.addEventListener(
            'mousemove',
            (event)=> {
                window.scene.mouseMove(event);
            }
        );
    }

    animate() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.fillStyle = 'rgb('+COLORS.BG[0]+','+COLORS.BG[1]+','+COLORS.BG[2]+')';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.radar.move(this.frameCount);
        this.radar.draw(this.context);

        requestAnimationFrame(()=> {
            this.frameCount++;
            this.animate();
        })
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.radar.resize(this.canvas);
    }

    mouseMove(event) {
        this.radar.mousePosition.x = event.pageX;
        this.radar.mousePosition.y = event.pageY;
    }
}

document.addEventListener(
    'DOMContentLoaded',
    ()=> {
        window.scene = new Scene();
        scene.initialize();
    }
);
window.addEventListener(
    'resize',
    ()=> {
        window.scene.resize();
    }
);