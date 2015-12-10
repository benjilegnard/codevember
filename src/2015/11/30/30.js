const TAU = Math.PI* 2,
      GRAVITY = .1,
      MAX_SPEED = 3,
      MAX_PARTICLES = 320,
      COLOR_CYCLE_STEP = 0.25,
      particles = [];



class Particle{
    constructor(opts){
        this.x = opts.x || canvas.width/2;
        this.y = opts.y || canvas.height/2;
        this.radius = opts.r || Math.floor(Math.random() * 10)+1;
        this.angle  = opts.a || Math.random() * TAU;
        this.speed  = opts.s || Math.random() * MAX_SPEED;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.colors = [[128,128,128],[255,255,255]];
        this.color = [0,0,0];
        this.alpha = 1;
        this.colorIndex = 0;
    }
    draw(context){
        context.beginPath();
        context.fillStyle = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',' + this.alpha + ')';
        context.arc(this.x,this.y, this.radius, 0, TAU, true);
        context.fill();
    }
    move(){
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        /*
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + GRAVITY;
        */
    }
    reset(x,y){
        this.x = x;
        this.y = y;
        this.radius = Math.floor(Math.random() * 10)+1;
        this.angle  = Math.random() * TAU;
        this.speed  = Math.random() * MAX_SPEED;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.alpha = 1;
        this.colorIndex = 0;
    }
    isAlive(){
        return this.radius > 0 && this.alpha > 0;
    }
    grow(){
        //fade towards next color
        if (this.colorIndex + 1 < this.colors.length) {
            this.colorCycle(this.colorIndex + 1);
        }
        //next color
        if (this.colors[this.colorIndex + 1] == this.color) {
            this.colorIndex++;
        }
    }
    colorCycle(toIndex){
        for(let rgb in this.color){
            if(this.color[rgb] < this.colors[toIndex][rgb])
                this.color[rgb] = this.color[rgb] + COLOR_CYCLE_STEP;
            else if(this.color[rgb] > this.colors[toIndex][rgb])
                this.color[rgb] = this.color[rgb] - COLOR_CYCLE_STEP;
        }
    }
}


class Smoke extends Particle{
    constructor(opts){
        super(opts);
        this.colors = [[255,255,255],[0,0,0]];
    }
    grow(){
        super.grow();
        this.radius += .2;
        this.alpha -= 0.01;
    }
    reset(x,y){
        super.reset(x,y);
    }
    move(){
        this.vy -= GRAVITY/2;
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Fire extends Particle{
    constructor(opts){
        super(opts);
        this.reset(this.x, this.y);
        this.colors = [[133,27,24],[0,0,0],[249,240,136]];
    }
    grow(){
        super.grow();
        this.radius -= 0.05;
    }
    reset(x,y){
        super.reset(x,y);
    }
}

class Scene {

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.particles = [];
        this.frameCount = 0;
    }

    initialize() {
        this.resize();
        this.mouse = {x:canvas.width/2,y:canvas.height/2};
        for(let i = 0; i < MAX_PARTICLES;i++){

            if(i%2) {
                this.particles.push(new Smoke({}));
            } else {
                this.particles.push(new Fire({}));

            }
        }
        this.animate();
        this.explode();
        this.canvas.addEventListener(
            'touchmove',
            (event)=> {
                event.touches.forEach((touchEvent)=>{
                    window.scene.mouseMove(touchEvent);
                });
            }
        );
        this.canvas.addEventListener('touchend',(event)=>{this.explode();});
        this.canvas.addEventListener('mouseup',(event)=>{this.explode();});
        this.canvas.addEventListener(
            'mousemove',
            (event)=> {
                window.scene.mouseMove(event);
            }
        );
    }
    explode(){
        this.particles.forEach(
            (p)=>{
                p.reset(this.mouse.x,this.mouse.y);
            }
        );
    }
    animate() {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        //this.context.fillStyle = 'rgb('+COLORS.BG[0]+','+COLORS.BG[1]+','+COLORS.BG[2]+')';
        //this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.particles.filter((particle)=>particle.isAlive()).forEach(
            (particle)=>{
                particle.draw(this.context);
                particle.grow();
                particle.move(this.frameCount);
            }
        );

        requestAnimationFrame(()=> {
            this.frameCount++;
            this.animate();
        })
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    mouseMove(event) {
        this.mouse.x = event.pageX;
        this.mouse.y = event.pageY;
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