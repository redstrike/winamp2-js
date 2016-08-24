import React from 'react';
import {connect} from 'react-redux';

export const getY = (value) => (
  32 - ((value / 100) * 32)
);

class EqGraph extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvasCtx = this.refs.canvas.getContext('2d');
    this.canvasCtx.imageSmoothingEnabled = false;
    this.width = this.refs.canvas.width * 1; // Cast to int
    this.height = this.refs.canvas.height * 1; // Cast to int
    this.bgImage = new Image();
    this.bgImage.onload = () => {
      this.createColorPattern();
      this.componentDidUpdate();
    };
    this.bgImage.src = 'bg.png';
  }

  componentDidUpdate() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);
    this.drawPreampLine();
    this.drawEqLine(); // This should paint on top of the preamp line
  }

  createColorPattern() {
    const colorsCanvas = document.createElement('canvas');
    const colorsCtx = colorsCanvas.getContext('2d');
    colorsCanvas.width = this.bgImage.width * 2;
    colorsCanvas.height = this.bgImage.height * 2;
    colorsCtx.drawImage(this.bgImage, 0, 0, colorsCanvas.width, colorsCanvas.height);
    this.colorPattern = this.canvasCtx.createPattern(colorsCanvas, 'repeat-x');
  }

  drawEqLine() {
    const {props} = this;
    const values = [
      props.band60,
      props.band170,
      props.band310,
      props.band600,
      props.band1k,
      props.band3k,
      props.band6k,
      props.band12k,
      props.band14k,
      props.band16k
    ];

    this.canvasCtx.strokeStyle = this.colorPattern;
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.beginPath();
    const paddingLeft = 4;
    // TODO: Curve these lines
    // TODO: Color these lines
    values.forEach((value, i) => {
      this.canvasCtx.lineTo(paddingLeft + (i * 16), getY(value));
    });
    this.canvasCtx.stroke();
  }

  drawPreampLine() {
    const preampValue = getY(this.props.preamp);
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = 'white';
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(0, preampValue);
    this.canvasCtx.lineTo(this.width, preampValue);
    this.canvasCtx.stroke();
  }

  render() {
    return <canvas
      id='eqGraph'
      ref='canvas'
      width='152'
      height='32'
    />;
  }
}

export default connect((state) => state.equalizer.sliders)(EqGraph);