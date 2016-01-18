/**
 * Created by Oakley Hall on 6/19/15.
 */

import React from 'react';
import _ from 'lodash';

export default React.createClass({
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
  getDefaultProps() {
    return {
      height: 600,
      width: 700,
      upArrow: 38,
      downArrow: 40,
      paddleHeight: 100,
      paddleWidth: 20,
      paddleSpeed: 5,
      ballSize: 10
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
      aiScore: 0
    }
  },
  componentDidMount: function() {
    this._setupCanvas();
    this._context.font = '30px Arial';
    this._context.fillText('Starting Game',
      this.props.width/2,
      this.props.height/2 );

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
  _startGame() {

    if(this._loop){
      return;
    }

    const keystate = this._keystate;
    document.addEventListener('keydown', function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function(evt) {
      delete keystate[evt.keyCode];
    });
    document.addEventListener('ontouchstart', function(e) {e.preventDefault()}, false);
    document.addEventListener('ontouchmove', function(e) {e.preventDefault()}, false);

    this._loop = setInterval( () => {
      this._update();
      this._draw();
    },1);
    this._ball().serve(1);
  },
  _stopGame() {
    clearInterval(this._loop);
    this._loop = null;
    setTimeout(()=>{
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }, 0);

  },
  _setupCanvas: function() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
  },
  _score(name) {
    const state = this.state;
    const scorer = {player: 'ai', ai: 'player'}[name];
    this.setState({
      [scorer+'Score']: state[scorer+'Score'] + 1
    });
    this._stopGame();
    setTimeout(()=>{
      this._context.font = '30px Arial';
      this._context.fillText(scorer + ' score!',
        this.props.width/2,
        this.props.height/2 );
      this._context.restore();
    }, 0);

    setTimeout(()=>{
      this._setupCanvas();
      this._startGame();
    }, 1000);
  },
  _draw() {
    // draw background
    const state = this.state;
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = "#fff";

    // draw scoreboard
    this._context.font = '10px Arial';
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
  _touch(evt) {
    console.log( evt );
    var yPos = evt.touches[0].pageY - evt.touches[0].target.offsetTop - this.props.paddleHeight/2;
    this._player().position(yPos);
  },
  render() {
    return <canvas
            onTouchStart={this._touch}
            onTouchMove={this._touch}
            style={this._canvasStyle}
            width={this.props.width}
            height={this.props.height}/>
  }
});
