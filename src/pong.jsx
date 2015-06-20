/**
 * Created by Oakley Hall on 6/19/15.
 */
let React = require('react');
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
      paddleWidth: 20
    }
  },

  getInitialState(){
    return {
      ballx: 100,
      bally: 100,
      ballSize: 20,
      ballSpeed: 12,
      velx: 1,
      vely: 1,
      aix: 670,
      aiy: 100,
      playerx: 10,
      playery: 100,
    }
  },

  componentDidMount: function() {
    let keystate = this._keystate;
    document.addEventListener('keydown', function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener('keyup', function(evt) {
      delete keystate[evt.keyCode];
    });
    this._setupCanvas();
  },


  _keystate: {},

  _canvas: undefined,

  _context: undefined,

  _setupCanvas: function() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
    let xdir = 1;
    let ydir = 1;
    setInterval( () => {
      const x = this.state.ballx;
      const y = this.state.bally;

      if(x===690){ xdir=-1 }
      if(x===10){ xdir=1 }
      if(y===590){ ydir=-1 }
      if(y===10){ ydir=1 }

      this.setState({ ballx: this.state.ballx + 1 * xdir })
      this.setState({ bally: this.state.bally + 1 * ydir })
      this._update();
      this._draw();
    },10);
  },

  _ball() {
    const context = this._context;
    const state = this.state;
    return {
      draw(){
        context.fillRect(state.ballx, state.bally,
          state.ballSize, state.ballSize);
      }
    };
  },

  _player() {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const keystate = this._keystate;
    let that = this;
    let py;

    return {
      update() {
          py = state.playery;
          if (keystate[props.upArrow]){
            py = state.playery - 7
            console.log( py );
            that.setState({playery: py});
          }
          if (keystate[props.downArrow]){
            py = state.playery + 7
            console.log( py );
            that.setState({playery: py});
          }
        // keep the paddle inside of the canvas
        py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
        that.setState({playery: py});

      },
      draw(){
        context.fillRect(state.playerx, state.playery,
          props.paddleWidth, props.paddleHeight);
      }
    };
  },

  _ai() {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    return {
      draw(){
        context.fillRect( state.aix, state.aiy,
          props.paddleWidth, props.paddleHeight);
      }
    };
  },

  _draw() {
    // draw background
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = "#fff";

    //draw ball
    this._ball().draw();

    //draw paddles
    this._player().draw();
    this._ai().draw();

    // draw the net
    let w = 4;
    let x = (this.props.width - w)*0.5;
    let y = 0;
    const step = this.props.height/20; // how many net segments
    while (y < this.props.height) {
      this._context.fillRect(x, y+step*0.25, w, step*0.5);
      y += step;
    }

    this._context.restore();
  },

  _update(){
    this._player().update();
  },

  render() {
    return <canvas width={this.props.width} height={this.props.height} />;
  }

});
