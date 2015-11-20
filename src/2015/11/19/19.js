/*
 ♚ ♛ ♜ ♝ ♞ ♟
 ♔ ♕ ♖ ♗ ♘ ♙

 - https://github.com/jhlywa/chess.js
 - https://en.wikipedia.org/wiki/Portable_Game_Notation
 - https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
 */
const FONTS = ['Arial'];

class Board{
    constructor(){

    }
    render(){

    }
}

class Game{
    constructor(){

    }
}
class PGNParser{
    constructor(){
        this.games = [];
        this.currentGame = new Game();
    }
    setPGN(stringValue){
        this.serialized = stringValue;
        this.gameSplitter();
    }
    gameSplitter(){

    }
    gameReader(){
        //Extract game properties
        const props = /^\[(\w*)\s"(.*)"]$/gmi.split(this.serialized);
        props.forEach((propery)=>{

        });
    }
    turnSplitter(){

    }
    buildGame(index){

    }
}

class Popin{
    constructor(el){
        this.el = el;
    }
    close(){
        this.el.classList.remove('opened');
        this.el.classList.toogle('closed');
    }
}