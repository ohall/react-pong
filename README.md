# react-pong
A simple ping-pong game in as a React component.

Inspired by [Max Wihlborg](https://github.com/maxwihlborg/youtube-tutorials)

[See demo here](http://ohall.github.io/react-pong)

### Props

#### height: React.PropTypes.number
Height of canvas element in px

default: 600

#### width: React.PropTypes.number
Width of canvas element in px

default: 700,
      
#### upArrow: React.PropTypes.number
Keyboard code for moving paddle in up direction

default: 38

#### downArrow: React.PropTypes.number
Keyboard code for moving paddle in down direction

default: 40

#### ballSize: React.PropTypes.number
Diameter of ball in pixels

default: 10

#### paddleHeight: React.PropTypes.number
Height of both paddles in pixels

default: 100

#### paddleWidth: React.PropTypes.number
Thickness of both paddles in pixels

default: 20

#### paddleSpeed: React.PropTypes.number
Number of pixels moved by player paddle on key press      

default: 5
