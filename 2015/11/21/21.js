'use strict';

var LINE_COLOR = 'white';
var BACK_COLOR = 'rgb(0,0,0)';
var SOUND_SOURCE = 'http://media.soundcloud.com/stream/vOY0tiM1S6pU.mp3';
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

var gainNode = audioContext.createGain();
var analyser = audioContext.createAnalyser();

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
analyser.fftSize = 512;
var buffer = null;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

function playSound(buffer) {
    var source = audioContext.createBufferSource(); // creates a sound source
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.connect(analyser);
    source.loop = true;
    source.start();
}

function draw() {
    analyser.getByteFrequencyData(dataArray);

    var baseY = canvas.height / 2,
        path = new Path2D();
    path.moveTo(0, baseY);
    var spaceX = canvas.width / bufferLength;
    for (var i = 0; i < bufferLength; i++) {
        var y = dataArray[i] / 128 * baseY - baseY;
        path.lineTo(i * spaceX, y + baseY);
    }
    context.strokeStyle = LINE_COLOR;
    context.stroke(path);
}

function animate(timestamp) {
    context.fillStyle = BACK_COLOR;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
    //Draw
    draw();
    requestAnimationFrame(animate);
}

function resize(event) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loaded(event) {
    audioContext.decodeAudioData(this.response, playSound);
}

function requestSource() {
    var request = new XMLHttpRequest();
    request.responseType = "arraybuffer";
    request.addEventListener("load", loaded);
    request.open("GET", SOUND_SOURCE);
    request.send();
}

function initialize(event) {
    requestSource();
    resize();
    animate();
}

window.addEventListener('resize', resize);
document.addEventListener('DOMContentLoaded', initialize);