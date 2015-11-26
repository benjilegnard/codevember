const
    TAU = Math.PI*2,
    DEVIATION_SPEED = TAU / 360,
    MAX_PARTICLES = 24, //number of particles
    MAX_LIFE = 120,//in frames
    RADIUS = 1,
    DRAWING_SPEED = 4,
    canvas = document.getElementById('canvas'),
    seamless = document.getElementById('seamless'),
    context = canvas.getContext('2d'),
    particles = [];

class Particle{
    constructor(x,y,a){
        this.x = x;
        this.y = y;
        this.direction = a;
        this.radius = RADIUS;
        this.color ='black';
        this.offset = TAU * Math.random();
        this.deviation = TAU * Math.random();
        this.distance = 0;
    }
    move(){
        this.distance +=.1;
        this.deviation += DEVIATION_SPEED;
        this.direction = this.direction + this.deviation;
        this.x += Math.cos(this.direction) * (DRAWING_SPEED+this.distance);
        this.y += Math.sin(this.direction) * (DRAWING_SPEED+this.distance);
    }
    draw(){
        context.globalCompositeOperation = 'xor';
        context.beginPath();
        context.fillStyle=this.color;
        context.arc(this.x, this.y, this.radius, 0, TAU, true);
        //context.fillRect(Math.floor(this.x),Math.floor(this.y),this.radius,this.radius);
        context.fill();
    }
    collide(canvas){
        if(this.x > canvas.width )
            this.x = 0;
        if(this.y > canvas.height )
            this.y = 0;
        if(this.x < 0)
            this.x = canvas.width ;
        if(this.y < 0)
            this.y = canvas.height;
    }
}
let life = MAX_LIFE;
const
    refreshBackground = () => {
        //console.log(''+canvas.toDataURL());
        document.body.style.backgroundImage = 'url('+canvas.toDataURL().replace('\"','\'')+')';
    },
    animate = () => {
        //context.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((part)=>{
            part.draw();
            part.move();
            part.collide(canvas);
        });
        refreshBackground();
        life--;
        if(life < 0){
            refreshBackground();
        }/*else{
            requestAnimationFrame(animate);
        }*/
    },
    initialize = () => {
        for(let i=0;i < MAX_PARTICLES;i++)
        {
            particles.push(
                new Particle(
                    Math.floor(Math.random()*canvas.width),
                    Math.floor(Math.random()*canvas.height),
                    TAU * Math.random()
                )
            );
        }
        while (life>0){
            animate();
        }
    };

document.addEventListener('DOMContentLoaded',()=>{
    initialize();
    animate();
});