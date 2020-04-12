import { SVG } from '@svgdotjs/svg.js';
import createCircle from './createCircle';

type Transform = {
  rotate?: number;
  translateX?: number;
  translateY?: number;
  scale?: number;
};

export default function () {
  var draw = SVG().addTo('#canvas').size(300, 300);

  const svgCoords: ClientRect = document
    .getElementsByTagName('svg')[0]
    .getBoundingClientRect();

  createCircle(
    draw,
    {
      radius: 30,
      color: '#0095ff',
      startPos: {
        x: 99,
        y: 90,
      },
    },
    svgCoords
  );
}
