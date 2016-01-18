/**
 * Created by Oakley Hall on 6/23/15.
 */
'use strict';

module.exports = function () {
  var context = this._context;
  var state = this.state;
  var props = this.props;
  var keystate = this._keystate;
  var that = this;
  var py = undefined;

  return {
    update: function update() {
      py = state.playery;
      if (keystate[props.upArrow]) {
        py = state.playery - props.paddleSpeed;
        that.setState({ playery: py });
      }
      if (keystate[props.downArrow]) {
        py = state.playery + props.paddleSpeed;
        that.setState({ playery: py });
      }
      // keep the paddle inside of the canvas
      py = Math.max(Math.min(py, props.height - props.paddleHeight), 0);
      that.setState({ playery: py });
    },
    draw: function draw() {
      context.fillRect(state.playerx, state.playery, props.paddleWidth, props.paddleHeight);
    },
    name: function name() {
      return 'player';
    },
    position: function position(y) {
      if (y) {
        that.setState({ playery: y });
      }
      return {
        x: state.playerx,
        y: state.playery
      };
    }
  };
};