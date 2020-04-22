import PubSub from 'pubsub-js';
import '@svgdotjs/svg.draggable.js';
import { get } from 'lodash';

/**
 * create a circle movable inside a drawing context
 * @param {draw} svg element to append to
 * @param {CircleConfig} circleConfig
 * @param {ClientRect} svgCoords
 */

export const CoordChange = Symbol('CoordChange');

export type Coords = {
  x: number;
  y: number;
};

type CircleConfig = {
  radius: number;
  color: string;
  startPos: Coords;
};

export type EndOfEdge = {
  label: string;
  coords: Coords;
};

const inConstrains = (svgCoords: ClientRect, evt: MouseEvent, gap: number) => {
  const { clientX, clientY } = evt;
  const { left, right, top, bottom } = svgCoords;
  if (clientX - left > gap && right - clientX > gap) {
    if (clientY - top > gap && bottom - clientY > gap) {
      return true;
    }
  }
  return false;
};

export const drawText = (draw: any, text: string, position: Coords) => {
  const textElement = draw.text(text);
  textElement.fill('#000');

  textElement.font({
    family: 'Helvetica',
    size: 18,
  });
  textElement.addClass('graph-text');
  textElement.move(position.x, position.y);

  return textElement;
};

export default function createCircle(draw: any, circleConfig: CircleConfig) {
  const { startPos } = circleConfig;
  console.log(startPos);
  // init
  var circle = draw
    .circle(circleConfig.radius * 2)
    .attr({ fill: circleConfig.color });
  circle.move(startPos.x, startPos.y);

  return circle;
}

export const createNamedNode = (
  draw: any,
  circleConfig: CircleConfig,
  text: string,
  svgCoords: ClientRect
) => {
  console.log(circleConfig);
  const nodeCircle = createCircle(draw, circleConfig);
  const { startPos } = circleConfig;
  const textPos = {
    x: startPos.x + 20,
    y: startPos.y + 10,
  };
  const addEdgePosition = {
    x: startPos.x + 20,
    y: startPos.y - 20,
  };

  const nodeText = drawText(draw, text, textPos);

  const node = draw.group();
  node.addClass('graph-point');
  node.attr('cursor', 'pointer');
  node.attr('fill-opacity', '0.5');

  const addEdge = createEdgeConnector(draw, addEdgePosition, text);

  node.add(nodeText).add(nodeCircle).add(addEdge);
  node.draggable();
  node.on('dragend', function (evt: MouseEvent) {
    const { target } = evt;

    if (target) {
      const circle = (<HTMLElement>target).getElementsByTagName('circle')[0];
      const x = parseInt(circle.getAttribute('cx'), 10);
      const y = parseInt(circle.getAttribute('cy'), 10);
      const coords = { x, y };
      const data = { coords, label: text };
      PubSub.publish(CoordChange, data);
    }
  });
  return node;
};

export const createEdgeConnector = (
  draw: any,
  position: Coords,
  label: string
) => {
  const ADD = '+';
  const state = {
    isActive: false,
    colors: {
      black: '#000',
      red: 'red',
    },
  };

  const textElement = draw.text(ADD);
  textElement.fill();

  textElement.font({
    family: 'Helvetica',
    size: 22,
  });
  textElement.addClass('graph-text');
  textElement.move(position.x, position.y);

  textElement.on('click', (evt: MouseEvent) => {
    console.log(evt);
    const coords = {
      x: evt.clientX,
      y: evt.clientY,
    };
    const data = { label, coords };
    state.isActive = !state.isActive;
    textElement.fill(state.isActive ? state.colors.red : state.colors.black);

    PubSub.publish('addEdgeTo', data);
  });

  return textElement;
};
