'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 ♚ ♛ ♜ ♝ ♞ ♟
 ♔ ♕ ♖ ♗ ♘ ♙

 - https://github.com/jhlywa/chess.js
 - https://en.wikipedia.org/wiki/Portable_Game_Notation
 - https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
 */
var FONTS = ['Arial'];

var Board = (function () {
    function Board() {
        _classCallCheck(this, Board);
    }

    _createClass(Board, [{
        key: 'render',
        value: function render() {}
    }]);

    return Board;
})();

var Game = function Game() {
    _classCallCheck(this, Game);
};

var PGNParser = (function () {
    function PGNParser() {
        _classCallCheck(this, PGNParser);

        this.games = [];
        this.currentGame = new Game();
    }

    _createClass(PGNParser, [{
        key: 'setPGN',
        value: function setPGN(stringValue) {
            this.serialized = stringValue;
            this.gameSplitter();
        }
    }, {
        key: 'gameSplitter',
        value: function gameSplitter() {}
    }, {
        key: 'gameReader',
        value: function gameReader() {
            //Extract game properties
            var props = /^\[(\w*)\s"(.*)"]$/gmi.split(this.serialized);
            props.forEach(function (propery) {});
        }
    }, {
        key: 'turnSplitter',
        value: function turnSplitter() {}
    }, {
        key: 'buildGame',
        value: function buildGame(index) {}
    }]);

    return PGNParser;
})();

var Popin = (function () {
    function Popin(el) {
        _classCallCheck(this, Popin);

        this.el = el;
    }

    _createClass(Popin, [{
        key: 'close',
        value: function close() {
            this.el.classList.remove('opened');
            this.el.classList.toogle('closed');
        }
    }]);

    return Popin;
})();
//# sourceMappingURL=19.js.map
