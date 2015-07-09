# react-pong
A simple ping-pong game as a React component composed in ES6.

![](http://i.imgur.com/tpm0k7u.gif)

Inspired by [Max Wihlborg](https://github.com/maxwihlborg/youtube-tutorials)

[See demo here](http://ohall.github.io/react-pong)


### Add to your project:
```
npm install --save react-pong
```

### Usage:
```
import Pong from 'react-pong';

React.render(
  <Pong/>,
  document.getElementById('container')
);
```
### Properties/API:

- `height` - Number - Height of canvas element in px - default: 600
- `width` - Number - Width of canvas element in px - default: 700,
- `upArrow` - Number - Keyboard code for moving paddle in up direction - default: 38
- `downArrow` - Number - Keyboard code for moving paddle in down direction - default: 40
- `ballSize` - Number - Diameter of ball in pixels - default: 10
- `paddleHeight` - Number - Height of both paddles in pixels - default: 100
- `paddleWidth` - Number - Thickness of both paddles in pixels - default: 20
- `paddleSpeed` - Number - Number of pixels moved by player paddle on key press - default: 5
