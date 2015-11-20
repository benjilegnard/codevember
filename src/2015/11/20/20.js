//https://en.wikipedia.org/wiki/Elder_Futhark
//http://rationalwiki.org/wiki/File:Runes_futhark_old.png
//https://en.wikipedia.org/wiki/Elder_Futhark
//http://rationalwiki.org/wiki/File:Runes_futhark_old.png
const RUNES = {},
    TAU = Math.PI * 2,
    EDGE_RADIUS = 50,

    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

const
    drawLine = (start, end) => {
        const startPoint = randomPointAroundEdge(start),
            endPoint = randomPointAroundEdge(end);
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x,endPoint.y);
        context.stroke();
    },
    randomPointAroundEdge = (point)=> {
        const randomRadius = Math.floor(Math.random() * EDGE_RADIUS) || 1,
            randomAngle = Math.random() * TAU;
        point.x += randomRadius * Math.cos(randomAngle);
        point.y += randomRadius * Math.sin(randomAngle);
    },
    resize = ()=> {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    },
    animate = ()=> {
        drawLine({x:0,y:0},{x:canvas.width,y:canvas.height});
        requestAnimationFrame(animate);
    }, initialize = ()=> {
        context.strokeStyle = 'white';
        context.lineWidth = .5;
        resize();
        animate();
    };

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);