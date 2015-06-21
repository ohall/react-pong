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
      paddleWidth: 20,
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
    this._ball().serve(1);
  },


  _keystate: {},

  _canvas: undefined,

  _context: undefined,

  _setupCanvas: function() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
    setInterval( () => {
      this._update();
      this._draw();
    },60);
  },

  _ball() {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    const player = this._player();
    const ai = this._ai();
    const that = this;
    return {
      serve(side){
        console.log( 'Serve!' );
        // set the x and y position
        const r = Math.random();
        const phi = 0.1*pi*(1 - 2*r);
        that.setState({
          ballx: side === 1 ? state.playerx + props.paddleWidth : state.aix - props.ballSize,
          bally: (props.height - props.ballSize) * r,
          velx: props.ballSize * state.ballSpeed * Math.cos(phi) * side,
          vely: state.ballSpeed * Math.sin(phi)
        });
        console.log( JSON.stringify(state, null, 2) );
      },
      update() {
        // update position with current velocity
        let bx = state.ballx;
        let by = state.bally;
        let vx = state.velx;
        let vy = state.vely;

        //console.log('bx ' + bx );
        //console.log('by ' + by );
        //console.log('vx ' + vx );
        //console.log('vy ' + vy );

        that.setState({
          ballx: bx + vx,
          bally: by + vy
        });



        // check if out of the canvas in the y direction
        if (0 > by || by + props.ballSize > props.height) {

          console.log( 'Booink! Y' );

          // calculate and add the right offset, i.e. how far inside of the canvas the ball is
          let offset = state.vely < 0 ? 0 - state.bally : props.height - (state.bally+props.ballSize);
          that.setState({
            bally: by + 2 * offset,
            vely: vy * -1// mirror the y velocity
          });
        }

        // check againts target paddle to check collision in x direction
        let pdle = state.velx < 0 ? player : ai;

        // helper function to check intesection between two axis aligned bounding boxex (AABB)
        let AABBIntersect = (paddleX, paddleY, pWidth, pHeight, bx, by, bw, bh) => {
          return paddleX < bx + bw &&
                 paddleY < by + bh &&
                 bx < paddleX + pWidth &&
                 by < paddleY + pHeight;
        };
        if (AABBIntersect(pdle.position().x, pdle.position().y, props.paddleWidth, props.paddleHeight,
            state.ballx, state.bally, props.ballSize, props.ballSize)) {

          console.log( 'Booink! ' + pdle.name() );
          let n = ( state.bally + props.ballSize - pdle.position().y )/( props.paddleHeight + props.ballSize );
          let phi = 0.25 * pi * ( 2 * n - 1 ); // pi/4 = 45
          let smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;

          that.setState({
            ballx: pdle === player ?
            state.playerx + props.paddleWidth : state.aix - props.ballSize,

            velx: smash * ( pdle === player ? 1 : -1) * state.velx * Math.cos(phi),
            vely: smash * state.vely * Math.sin(phi)
          });
          console.log( JSON.stringify(state, null, 2) );
        }

        // reset the ball when ball outside of the canvas in the
        // x direction
        if (0 > state.ballx + props.ballSize || state.ballx > props.width) {
          this.serve( pdle.name() === player.name() ? 1 : -1);
        }
      },
      draw(){
        context.fillRect(state.ballx, state.bally,
          props.ballSize, props.ballSize);
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
            py = state.playery - 10;
            that.setState({playery: py});
          }
          if (keystate[props.downArrow]){
            py = state.playery + 10;
            that.setState({playery: py});
          }
        // keep the paddle inside of the canvas
        py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
        that.setState({playery: py});

      },
      draw(){
        context.fillRect(state.playerx, state.playery,
          props.paddleWidth, props.paddleHeight);
      },
      name(){
        return 'player';
      },
      position(){
        return{
          x: state.playerx,
          y: state.playery
        }
      }
    };
  },

  _ai() {
    const context = this._context;
    const state = this.state;
    const props = this.props;
    let that = this;
    let py;

    return {
      update: function() {
        py = state.aiy
        const desty = state.bally - (props.paddleHeight - props.ballSize)*0.5;
        py = py + (desty - py) * 0.1
        that.setState({aiy: py})
      },
      draw(){
        context.fillRect( state.aix, state.aiy,
          props.paddleWidth, props.paddleHeight);
      },
      name(){
        return 'ai';
      },
      position(){
        return{
          x: state.aix,
          y: state.aiy
        }
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
    this._ai().update();
    this._ball().update();
  },

  render() {
    return <canvas width={this.props.width} height={this.props.height} />;
  }

});
