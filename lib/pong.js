/**
 * Created by Oakley Hall on 6/19/15.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

var React = require('react');

exports['default'] = React.createClass({
  displayName: 'pong',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    upArrow: React.PropTypes.number,
    downArrow: React.PropTypes.number,
    ballSize: React.PropTypes.number,
    paddleHeight: React.PropTypes.number,
    paddleWidth: React.PropTypes.number,
    paddleSpeed: React.PropTypes.number
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: 600,
      width: 700,
      upArrow: 38,
      downArrow: 40,
      paddleHeight: 100,
      paddleWidth: 20,
      paddleSpeed: 5,
      ballSize: 10
    };
  },
  getInitialState: function getInitialState() {
    return {
      ballx: 100,
      bally: 100,
      ballSpeed: 2,
      velx: 0,
      vely: 0,
      aix: 670,
      aiy: 100,
      playerx: 10,
      playery: 100,
      playerScore: 0,
      aiScore: 0
    };
  },
  componentDidMount: function componentDidMount() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Start Game', this.props.width / 2, this.props.height / 2);
  },
  _keystate: {},
  _canvas: undefined,
  _context: undefined,
  _ball: require('./ball'),
  _player: require('./player'),
  _ai: require('./ai'),
  _loop: null,
  _canvasStyle: {
    display: 'block',
    position: 'absolute',
    margin: 'auto',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0'
  },
  _startGame: function _startGame() {
    var _this = this;

    if (this._loop) {
      return;
    }

    var keystate = this._keystate;
    document.addEventListener('keydown', function (evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function (evt) {
      delete keystate[evt.keyCode];
    });
    this._loop = setInterval(function () {
      _this._update();
      _this._draw();
    }, 1);
    this._ball().serve(1);
  },
  _stopGame: function _stopGame() {
    var _this2 = this;

    clearInterval(this._loop);
    this._loop = null;
    setTimeout(function () {
      _this2._context.clearRect(0, 0, _this2._canvas.width, _this2._canvas.height);
    }, 0);
  },
  _setupCanvas: function _setupCanvas() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
  },
  _score: function _score(name) {
    var _this3 = this;

    var state = this.state;
    var scorer = ({ player: 'ai', ai: 'player' })[name];
    this.setState(_defineProperty({}, scorer + 'Score', state[scorer + 'Score'] + 1));
    this._stopGame();
    setTimeout(function () {
      _this3._context.font = '30px Arial';
      _this3._context.fillText(scorer + ' score!', _this3.props.width / 2, _this3.props.height / 2);
      _this3._context.restore();
    }, 0);

    setTimeout(function () {
      _this3._setupCanvas();
      _this3._startGame();
    }, 1000);
  },
  _draw: function _draw() {
    // draw background
    var state = this.state;
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = '#fff';

    // draw scoreboard
    this._context.font = '10px Arial';
    this._context.fillText('Player: ' + state.playerScore, 10, 10);
    this._context.fillText('CPU: ' + state.aiScore, 500, 10);

    //draw ball
    this._ball().draw();

    //draw paddles
    this._player().draw();
    this._ai().draw();
    // draw the net
    var w = 4;
    var x = (this.props.width - w) * 0.5;
    var y = 0;
    var step = this.props.height / 20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }

    this._context.restore();
  },
  _update: function _update() {
    this._player().update();
    this._ai().update();
    this._ball().update();
  },
  render: function render() {
    return React.createElement('canvas', {
      style: this._canvasStyle,
      onClick: this._startGame,
      width: this.props.width,
      height: this.props.height });
  }
});
module.exports = exports['default'];