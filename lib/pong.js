/**
 * Created by Oakley Hall on 6/19/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

exports['default'] = _react2['default'].createClass({
  displayName: 'pong',

  propTypes: {
    height: _react2['default'].PropTypes.number,
    width: _react2['default'].PropTypes.number,
    upArrow: _react2['default'].PropTypes.number,
    downArrow: _react2['default'].PropTypes.number,
    ballSize: _react2['default'].PropTypes.number,
    paddleHeight: _react2['default'].PropTypes.number,
    paddleWidth: _react2['default'].PropTypes.number,
    paddleSpeed: _react2['default'].PropTypes.number
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
    this._context.fillText('Starting Game', this.props.width / 2, this.props.height / 2);

    setTimeout(this._startGame, 1000);
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
    document.addEventListener('ontouchstart', function (e) {
      e.preventDefault();
    }, false);
    document.addEventListener('ontouchmove', function (e) {
      e.preventDefault();
    }, false);

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
  _touch: function _touch(evt) {
    console.log(evt);
    var yPos = evt.touches[0].pageY - evt.touches[0].target.offsetTop - this.props.paddleHeight / 2;
    this._player().position(yPos);
  },
  render: function render() {
    return _react2['default'].createElement('canvas', {
      onTouchStart: this._touch,
      onTouchMove: this._touch,
      style: this._canvasStyle,
      width: this.props.width,
      height: this.props.height });
  }
});
module.exports = exports['default'];