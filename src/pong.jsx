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
      downArrow: 40
    }
  },
  getInitialState(){
    return {
      ballx:0,
      bally:0,
      velx:0,
      vely:0,
      ballside: 20,
      ballspeed: 12,
      playerx:0,
      playery:0,
      aix:0,
      aiy:0
    }
  },
  componentDidMount: function() {
    let keystate = this._keystate;
    this._setupCanvas();

    // keep track of keyboard presses
    document.addEventListener("keydown", function(evt) {
      keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) {
      delete keystate[evt.keyCode];
    });
    this._init(); // initiate game objects
    // game loop function
    var loop = function() {
      this._update();
      this._draw();
      window.requestAnimationFrame(loop, this._canvas);
    }.bind(this);
    window.requestAnimationFrame(loop, this._canvas);
  },
  _keystate: {},
  _canvas: undefined,
  _context: undefined,
  _player(){
    return {
      that: this,
      width:  20,
      height: 100,
      /**
       * Update the position depending on pressed keys
       */
      update() {
        let setState = this.that.setState;
        let state = this.that.state;
        let that = this.that;
        if (that._keystate[that.props.upArrow]){
          setState({ playerx: state.playerx -= 7});
        }
        if (that._keystate[that.props.downArrow]){
          setState({ playery: state.playery -= 7});
        }
        // keep the paddle inside of the canvas
        setState({ playery: Math.max(Math.min(state.playery, that.props.height - this.height), 0)});
      },
      /**
       * Draw the player paddle to the canvas
       */
      draw() {
        this.that._context.fillRect(this.that.state.playerx, this.that.state.playery, this.width, this.height);
      }
    }
  },
  _ai(){
    return {
      that: this,
      width:  20,
      height: 100,
      /**
       * Update the position depending on the ball position
       */
      update() {
        let that = this.that;
        let setState = this.that.setState;
        let state = this.that.state;
        var ball = that._ball;
        var props = that.props;
        // calculate ideal position
        var desty = ball.y - (this.height - ball.side)*0.5;
        // ease the movement towards the ideal position
        this.y += (desty - this.y) * 0.1;
        setState({ aiy: state.aiy -= 7});

        // keep the paddle inside of the canvas
        this.y = Math.max(Math.min(this.y, props.height - this.height), 0);
      },
      /**
       * Draw the ai paddle to the canvas
       */
      draw() {
        this.that._context.fillRect(this.x, this.y, this.width, this.height);
      }
    };
  },

  _ball(){
    return {
      that: this,
      /**
       * Serves the ball towards the specified side
       *
       * @param  {number} side 1 right
       *                       -1 left
       */
      serve(side) {
        console.log( 'serve ' + side );
        // set the x and y position
        var r = Math.random();
        let player = this.that._player();
        let props = this.that.props;
        let ai = this.that._ai();
        let setState = this.that.setState;
        let state = this.that.state;
        setState({x : side === 1 ? playerx + player.width : ai.x - state.side });
        setState({y : (props.height - this.side) * r});
        // calculate out-angle, higher/lower on the y-axis =>
        // steeper angle
        var phi = 0.1 * pi * (1 - 2*r);
        // set velocity direction and magnitude
        setState({velx: side * state.speed * Math.cos(phi),
                  vely: state.speed * Math.sin(phi) });
      },
      /**
       * Update the ball position and keep it within the canvas
       */
      update() {
        let setState = this.that.setState;
        let state = this.that.state;
        console.log( 'x velocity ' + state.vel.x );
        console.log( 'y velocity ' + state.vel.y );
        console.log( 'x pos ' + state.x  );
        console.log( 'y pos ' + state.y );
        let player = this.that._player();
        let ai = this.that._ai();
        let props = this.that.props;

        // update position with current velocity
        setState({x : state.x + state.vel.x});
        setState({y : state.y + state.vel.y});
        // check if out of the canvas in the y direction
        if (0 > state.y || state.y + state.side > props.height) {
          // calculate and add the right offset, i.e. how far
          // inside of the canvas the ball is
          var offset = state.vel.y < 0 ? 0 - state.y : props.height - (state.y+state.side);
          setState({y : state.y + 2 * offset});
          // mirror the y velocity
          setState({vel: {
            y: state.vel.y * -1,
            x: state.vel.x
          }});
        }
        // helper function to check intesectiont between two
        // axis aligned bounding boxex (AABB)
        var AABBIntersect = (ax, ay, aw, ah, bx, by, bw, bh) => {
          return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
        };
        // check againts target paddle to check collision in x
        // direction
        var pdle = state.vel.x < 0 ? player : ai;
        if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height,
            state.x, state.y, state.side, state.side)
        ) {
          // set the x position and calculate reflection angle
          setState({x : pdle===player ? playerx+player.width : ai.x - state.side});
          var n = (state.y+state.side - pdle.y)/(pdle.height+state.side);
          var phi = 0.25*pi*(2*n - 1); // pi/4 = 45
          // calculate smash value and update velocity
          var smash = Math.abs(phi) > 0.2*pi ? 1.5 : 1;
          setState({vel: {
            y: smash * ( pdle === player ? 1 : -1) * state.speed * Math.cos(phi),
            x: smash * state.speed * Math.sin(phi)
          }});
        }
        // reset the ball when ball outside of the canvas in the
        // x direction
        if (0 > state.x + state.side || state.x > props.width) {
          this.serve( pdle === player ? 1 : -1);
        }
      },
      /**
       * Draw the ball to the canvas
       */
      draw() {
        this.that._context.fillRect(state.x, state.y, state.side, state.side);
      }
    };
  },

  _init() {
    this._player().x = this._player().width;
    this._player().y = (this.props.height - this._player().height)/2;
    this._ai().x = this.props.width - (this._player().width + this._ai().width);
    this._ai().y = (this.props.height - this._ai().height)/2;
    this._ball().serve(1);
  },

  _update() {
    this._ball().update();
    this._player().update();
    this._ai().update();
  },
  _setupCanvas: function() {
    this._canvas = this.getDOMNode();
    this._context = this._canvas.getContext('2d');
  },
  _draw() {
    this._context.fillRect(0, 0, this.props.width, this.props.height);
    this._context.save();
    this._context.fillStyle = "#fff";
    this._ball().draw();
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
  render() {
    return <canvas ref="canvas"
                   width={this.props.width}
                   height={this.props.height} />;
  }

});
