'use strict';

// @see https://en.wikipedia.org/wiki/Seven-segment_display
/** abcdefg :
 -   a
 - f   b
 -   g
 - e   c
 -   d
 */

/**
 * Array of equivalence  between digit/ binary bars to light
 * example : index of the tab : binary abcdefg to display in hexadecimal when called with .toString(2)
 * (1111110) will light bars a b c d e f but not g.
 *
 * @see https://en.wikipedia.org/wiki/Seven-segment_display#Displaying_letters
 * @type {number[]}
 */
var DIGIT_TO_HEX = [0x7E, 0x30, 0x6D, 0x79, 0x33, 0x5B, 0x5F, 0x70, 0x7F, 0x7B];
/**
 * Returns a binary representation of the seven segment bars to light.
 *
 * @param i the digit to display (index of the array)
 * @returns {string} 7 bits in a string.
 */
var barToLightFromInt = function barToLightFromInt(i) {
    var s = DIGIT_TO_HEX[i].toString(2);
    while (s.length < 7) s = "0" + s;
    return s;
},

/**
 * Adds a leading 0 to an integer (for instance, takes 2, returns '02')
 * @param x
 * @returns {string} a string value of the integer.
 */
trimDigit = function trimDigit(x) {
    return ('' + x).length < 2 ? '0' + x : '' + x;
},

/**
 * Remove class off of a DOM Element.
 *
 * @param element
 * @param test
 */
toggleOnOff = function toggleOnOff(element, test) {
    if (test === '1') {
        element.classList.remove('off');
        element.classList.add('on');
    } else {
        element.classList.remove('on');
        element.classList.add('off');
    }
},
    applyToDOMElement = function applyToDOMElement(elem, digit) {
    var digits = barToLightFromInt(digit);
    for (var i = 0; i < digits.length; i++) {
        toggleOnOff(elem.children[i], digits[i]);
    }
},
    refreshDate = function refreshDate() {
    var date = new Date(),
        hour = trimDigit(date.getHours()),
        min = trimDigit(date.getMinutes()),
        sec = trimDigit(date.getSeconds());

    for (var i = 0; i < hour.length; i++) {
        applyToDOMElement(document.getElementById('h-' + (i + 1)), hour[i]);
    }
    for (var i = 0; i < min.length; i++) {
        applyToDOMElement(document.getElementById('m-' + (i + 1)), min[i]);
    }
    for (var i = 0; i < sec.length; i++) {
        applyToDOMElement(document.getElementById('s-' + (i + 1)), sec[i]);
    }
    requestAnimationFrame(refreshDate);
    //window.setTimeout(()=>refreshDate, 1000);
},
    drawBackground = function drawBackground() {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var color = Math.floor(Math.random() * 10),
                width = Math.floor(Math.random() * 10) + 1;
            context.fillStyle = 'rgb(' + color + ',' + color + ',' + color + ')';
            context.fillRect(x, y, width, 1);
            x += width - 1;
        }
    }
    //requestAnimationFrame(drawBackground);
},
    resize = function resize() {
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawBackground();
};

document.addEventListener('DOMContentLoaded', function () {
    resize();
    //refresh every seconds.
    refreshDate();
});
window.addEventListener('resize', resize);
//# sourceMappingURL=12.js.map
