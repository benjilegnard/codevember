const COLORS = {
        white:0xFFFFFF,
        pastelBlue:0xC9E6FF
    },
    TAU = Math.PI*2,

    FLAKE_BRANCHES = 3,
    FLAKE_ROOTS = 6,
    FLAKE_LENGTH = 4,

    FALL_VARIATION = TAU/12,
    FALL_SPEED = 1,
    TREE_MAX_HEIGHT=window.innerHeight,
    context = document.getElementById('snowflakes');

class Snowflake{
    constructor(props){
        this.position = {};
        this.position.x = props.x;
        this.position.y = props.y;
        this.position.z = props.z;
        this.radius = FLAKE_LENGTH / 1;
        this.rotation = props.rotation;
        this.direction = -TAU/4 + Math.random() * FALL_VARIATION;
    }
    move(frameCount){
        this.direction =  Math.sin(frameCount) * FALL_VARIATION;
        this.position.x += Math.cos(this.direction) * FALL_SPEED;
        this.position.y += Math.sin(this.direction) * FALL_SPEED;
    }
    draw(){
        context.strokeStyle = 'white';
        let branchDirection = this.direction;
        for(let i = 0; i<FLAKE_ROOTS;i++){
            context.beginPath();
            context.moveTo(
                this.position.x,
                this.position.y
            );
            context.lineTo(
                this.position.x + Math.cos(branchDirection) * this.radius ,
                this.position.y + Math.sin(branchDirection) * this.radius);
            context.stroke();
            branchDirection += TAU/FLAKE_ROOTS;
        }
    }
    reset(){
        if(this.y > canvas.height){
            this.y = 0 - this.radius;
        }
    }
}

class Tree{
    constructor(props){
        this.x = props.x;
        this.y = props.y;
        this.z = props.z;
        this.color = '#98CDDB';
    }
    reset(x,y,z){

    }
    draw(){
        context.moveTo(this.x,this.y - this.z * .5);
        context.lineTo()
    }
    fall(){

    }
}

class Scene{

}
