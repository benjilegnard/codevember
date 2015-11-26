const LINE_COLOR = 'white';
const BACK_COLOR = 'rgb(0,0,0)';
const SOUND_SOURCE = 'http://media.soundcloud.com/stream/vOY0tiM1S6pU.mp3';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();
const analyser = audioContext.createAnalyser();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

analyser.fftSize = 512;
var buffer = null;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

const
    playSound =
        (buffer) => {
            let source = audioContext.createBufferSource(); // creates a sound source
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(audioContext.destination);
            source.connect(analyser);
            source.loop = true;
            source.start();
        },
    draw =
        () => {
            analyser.getByteFrequencyData(dataArray);

            var baseY = canvas.height / 2,
                path = new Path2D();
            path.moveTo(0, baseY);
            var spaceX = canvas.width / bufferLength;
            for (let i = 0; i < bufferLength; i++) {
                let y = dataArray[i] / 128 * baseY - baseY;
                path.lineTo(
                    i * spaceX,
                    y + baseY);
            }
            context.strokeStyle = LINE_COLOR;
            context.stroke(path);
        },
    animate = (timestamp) => {
        context.fillStyle = BACK_COLOR;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
        //Draw
        draw();
        requestAnimationFrame(animate);
    },
    resize =
        (event) => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        },
    loaded =
        (event) => {
            audioContext.decodeAudioData(this.response, playSound);
        },
    requestSource =
        ()=> {
            let request = new XMLHttpRequest();
            request.responseType = "arraybuffer";
            request.addEventListener("load", loaded);
            request.open("GET", SOUND_SOURCE);
            request.send();
        },
    initialize =
        (event) => {
            requestSource();
            resize();
            animate();
        };

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);