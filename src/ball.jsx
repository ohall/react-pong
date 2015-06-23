/**
 * Created by Oakley Hall on 6/23/15.
 */

module.exports = function(){
  const context = this._context;
  const state = this.state;
  const props = this.props;
  const player = this._player();
  const score = this._score;
  const ai = this._ai();
  const that = this;
  const r = Math.random();

  return {
    serve(side){
      // set the x and y position
      const phi = 0.1*pi*(1 - 2*r);
      that.setState({
        ballx: side === 1 ? state.playerx + props.paddleWidth : state.aix - props.ballSize,
        bally: (props.height - props.ballSize) * r,
        velx: state.ballSpeed * Math.cos(phi) * side,
        vely: state.ballSpeed * Math.sin(phi)
      });
    },
    update() {
      // update position with current velocity
      const bx = state.ballx;
      const by = state.bally;
      const vx = state.velx;
      const vy = state.vely;

      that.setState({
        ballx: bx + vx,
        bally: by + vy
      });

      if (0 > by || by + props.ballSize > props.height) {
        const offset = state.vely < 0 ? 0 - state.bally : props.height - (state.bally+props.ballSize);
        that.setState({
          bally: by + 2 * offset,
          vely: vy * -1// mirror the y velocity
        });
      }

      const pdle = state.velx < 0 ? player : ai;

      const AABBIntersect = (paddleX, paddleY, pWidth, pHeight, bx, by, bw, bh) => {
        return paddleX < bx + bw &&
          paddleY < by + bh &&
          bx < paddleX + pWidth &&
          by < paddleY + pHeight;
      };
      if (AABBIntersect(pdle.position().x, pdle.position().y, props.paddleWidth, props.paddleHeight,
          state.ballx, state.bally, props.ballSize, props.ballSize)) {

        const dir = state.velx < 0 ? 1 : -1;

        // where along the pa
        const n = ( state.bally + props.ballSize - pdle.position().y )/( props.paddleHeight + props.ballSize );
        const phi = (0.25 * pi) * ( 2 * n + dir ) + r; // pi/4 = 45
        const smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;

        that.setState({
          ballx: pdle === player ?
          state.playerx + props.paddleWidth : state.aix - props.ballSize,
          velx: smash * -1 * state.velx,
          vely: smash * state.velx * Math.sin(phi)
        });
      }

      // x bound
      if (0 > state.ballx + props.ballSize || state.ballx > props.width) {
        score(pdle.name());
        this.serve( pdle.name() === player.name() ? 1 : -1);
      }
    },
    draw(){
      context.fillRect(state.ballx, state.bally,
        props.ballSize, props.ballSize);
    }
  };
};