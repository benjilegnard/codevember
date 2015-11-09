const
    DEFAULT_SPEED = 0.5,
    BASE_COLOR='white',
    COLORS=[],
    POINTS_QUANTITY=32,
    LINE_WIDTH=0.5,
    MIN_DRAW_DISTANCE=20,
    MAX_DRAW_DISTANCE=200,
    LINE_ZIG = 5,
    LINE_ZAG = 40,
    SPEED = .6,

    canvas = document.getElementById('c'),
    context = canvas.getContext('2d'),
    points = [];

let
//resize
    resizer = (event) =>{
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
    },
    animator = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        points.forEach((point)=>{
            movePoint(point);
            collisionDetector(point);
            //creates a table of points that are near the current one.
            points.filter((obj) => {
                var distance = Math.sqrt( Math.pow((obj.x-point.x), 2) + Math.pow((obj.y-point.y), 2));
                return distance < MAX_DRAW_DISTANCE && distance > MIN_DRAW_DISTANCE;
            })
                .forEach((dest) => {
                    drawLine(point,dest);
                });
        });
        requestAnimationFrame(animator);
    },
    drawLine = function(origine,destination){
        context.beginPath();
        context.moveTo(origine.x, origine.y);
        context.lineTo(destination.x, destination.y);
        context.lineWidth = LINE_WIDTH;
        context.strokeStyle = BASE_COLOR;
        context.stroke();
    },
    zigZag = () => {

    },
    movePoint = (point) => {
        point.x += Math.cos(point.d)*SPEED;
        point.y += Math.sin(point.d)*SPEED;
    },
//if a point gets lost outside the canvas, put it back on the other side.
    collisionDetector = (point) => {
        if(point.x<0){
            point.x = window.innerWidth;
            return;
        }
        if(point.x > window.innerWidth){
            point.x = 0;
            return;
        }
        if(point.y<0){
            point.y == window.innerHeight;
            return;
        }
        if(point.y > window.innerHeight){
            point.y = 0;
            return;
        }
    },createPoint = () => {
        return {
            //random x position
            x: Math.floor(Math.random()*window.innerWidth),
            y: Math.floor(Math.random()*window.innerHeight),
            //random radian angle
            d:Math.random()*2*Math.PI,
            v:SPEED
        };
    },
    initPoints = () => {

        for(let i= 0; i < POINTS_QUANTITY; i++) {
            points.push(
                createPoint()
            );
        }
    },
    clickHandler = (event) => {
        const point = createPoint(event);
        point.x = event.offsetX;
        point.y = event.offsetY;
        points.push(point);
    },
    initializer = () => {
        resizer();
        initPoints();
        requestAnimationFrame(animator);
    };

window.addEventListener('resize', resizer, false);
document.addEventListener('DOMContentLoaded', initializer);