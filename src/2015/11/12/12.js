// @see https://en.wikipedia.org/wiki/Seven-segment_display
/** abcdefg :
 -   a
 - f   b
 -   g
 - e   c
 -   d
 */
//
/**
 * Array of equivalence  between digit/ binary bars to light
 * example : index of the tab : binary abcdefg to display in hexadecimal when called with .toString(2)
 * (1111110) will light bars a b c d e f but not g.
 *
 * @see https://en.wikipedia.org/wiki/Seven-segment_display#Displaying_letters
 * @type {number[]}
 */
const DIGIT_TO_HEX = [
        0x7E,
        0x30,
        0x6D,
        0x79,
        0x33,
        0x5B,
        0x5F,
        0x70,
        0x7F,
        0x7B
    ];
    /**
     * Returns a binary representation of the seven segment bars to light.
     *
     * @param i
     * @returns {string}
     */
const barToLightFromInt = (i)=> {
        return DIGIT_TO_HEX[i].toString(2);
    },
    /**
     * Adds a leading 0 to an integer (for instance, takes 2, returns '02')
     * @param x
     * @returns {string} a string value of the integer.
     */
    trimDigit = (x)=> {
        return ( ( '' + x ).length < 2) ? '0' + x : '' + x;
    },
    /**
     * Remove class off of a DOM Element.
     *
     * @param element
     * @param test
     */
    toggleOnOff = (element, test)=> {
        if (test) {
            element.classList.remove('off');
            element.classList.add('on');
        } else {
            element.classList.remove('on');
            element.classList.add('off');
        }
    },
    applyToDOMElement = (elem, digit) => {
        const digits = barToLightFromInt(digit);
        for (let i = 0; i < digits.length; i++) {
            toggleOnOff(elem.children[i],digits[i]);
        }
    },
    refreshDate = ()=> {
        const date = new Date(),
            hour = trimDigit(date.getHours()),
            min = trimDigit(date.getMinutes()),
            sec = trimDigit(date.getSeconds());

        for(let i = 0;i<hour.length;i++){
            applyToDOMElement(document.getElementById('h-'+(i+1)),hour[i]);
        }
        for(let i = 0;i<min.length;i++){
            applyToDOMElement(document.getElementById('m-'+(i+1)),min[i]);
        }
        for(let i = 0;i<sec.length;i++){
            applyToDOMElement(document.getElementById('s-'+(i+1)),sec[i]);
        }
        window.setTimeout(()=>refreshDate, 1000);
    },
    drawBackground = ()=> {
        const canvas = document.getElementById('canvas'),
            context = canvas.getContext('2d');
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const color = Math.floor(Math.random() * 100),
                    width = Math.floor(Math.random() * 10)+1;
                context.fillStyle = `rgb(${color},${color},${color})`;
                context.fillRect(x, y, width, 1);
                x += (width - 1);
            }
        }
    },
    resize = () => {
        const canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawBackground();
    };


document.addEventListener('DOMContentLoaded', ()=> {
    resize();
    //refresh every seconds.
    refreshDate();
});
window.addEventListener('resize', resize);