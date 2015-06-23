/**
 * Created by Oakley Hall on 6/19/15.
 */
const React = require('react');
const pi = Math.PI;

export default React.createClass({
  propTypes: {

  },
  getDefaultProps() {
    return {
      width: 700,
      height: 600,
      upArrow: 38,
      downArrow: 40,
      paddleHeight: 100,
      paddleWidth: 20,
      paddleSpeed: 5,
      ballSize: 20,
    }
  },
  getInitialState(){
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
      aiScore: 0,
    }
  },
  componentDidMount: function() {
    const keystate = this._keystate;
    document.addEventListener('keydown', function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function(evt) {
      delete keystate[evt.keyCode];
    });
    this._setupCanvas();
    this._ball().serve(1);
  },
  _keystate: {},
  _canvas: undefined,
  _context: undefined,
  _ball: require('./ball'),
  _player: require('./player'),
  _ai: require('./ai'),
  _loop: {},
  _startGame() {
    this._setupCanvas();
  },
  _stopGame() {

  },
  _setupCanvas: function() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
    yjid._loop = setInterval( () => {
      this._update();
      this._draw();
    },1);
  },
  _score(name) {
    const state = this.state;
    const scorer = {player: 'aiScore', ai: 'playerScore'}[name];
    this.setState({
      [scorer]: state[scorer] + 1
    });
  },
  _draw() {
    // draw background
    const state = this.state;
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = "#fff";

    this._context.font = '20px';
    this._context.fillText('Player: ' + state.playerScore , 10, 10 );
    this._context.fillText('CPU: ' + state.aiScore , 500, 10  );

    //draw ball
    this._ball().draw();

    //draw paddles
    this._player().draw();
    this._ai().draw();
    // draw the net
    const w = 4;
    const x = (this.props.width - w)*0.5;
    let y = 0;
    const step = this.props.height/20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }

    this._context.restore();
  },
  _update(){
    this._player().update();
    this._ai().update();
    this._ball().update();
  },
  render() {
    return <canvas width={this.props.width} height={this.props.height}/>
  }
});
