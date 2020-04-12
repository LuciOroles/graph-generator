import { get } from 'lodash';

/**
 * create a circle movable inside a drawing context
 * @param {draw} svg element to append to
 * @param {CircleConfig} circleConfig
 * @param {ClientRect} svgCoords
 */

export type Coords = {
  x: number;
  y: number;
};

type CircleConfig = {
  radius: number;
  color: string;
  startPos: Coords;
};

export const drawText = (
  draw: any,
  text: string,
  position: { x: number; y: number }
) => {
  const textElement = draw.text(text);
  textElement.fill('#fff');
  textElement.build(true);
  textElement.font({
    family: 'Helvetica',
    size: 24,
  });
  textElement.addClass('graph-text');
  textElement.move(position.x, position.y);

  return textElement;
};

export default function createCircle(draw: any, circleConfig: CircleConfig) {
  const { startPos } = circleConfig;
  // init
  var circle = draw
    .circle(circleConfig.radius * 2)
    .attr({ fill: circleConfig.color });
  circle.move(startPos.x, startPos.y);

  return circle;
}

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

// dragging
export const dragElement = (
  element: any,
  svgCoords: ClientRect,
  radius: number,
  onCoordsChange: (newCoords: Coords) => void
): any => {
  const movingElement = (evt: MouseEvent) => {
    const { clientX, clientY } = evt;

    if (inConstrains(svgCoords, evt, radius + 10)) {
      element.move(
        clientX - svgCoords.left - radius,
        clientY - svgCoords.top - radius
      );
    } else {
      // drop element from mouse down as cursor is out
      element.off('mousemove');
    }
  };

  element.on('mousedown', () => {
    element.on('mousemove', movingElement);
  });

  element.on(['mouseup'], () => {
    const coords: Coords = {
      x: get(element, 'node.firstChild.cx.baseVal.value', null),
      y: get(element, 'node.firstChild.cy.baseVal.value', null),
    };
    console.log(coords);
    onCoordsChange(coords);
    element.off('mousemove');
  });
};

export const createNamedNode = (
  draw: any,
  circleConfig: CircleConfig,
  text: string,
  svgCoords: ClientRect,
  onCoordsChange: (newCords: Coords) => void
) => {
  const nodeCircle = createCircle(draw, circleConfig);
  const { startPos } = circleConfig;
  const textPos = {
    x: startPos.x + 5,
    y: startPos.y + 7,
  };
  const nodeText = drawText(draw, text, textPos);

  const node = draw.group();
  node.addClass('graph-point');
  node.add(nodeCircle).add(nodeText);

  dragElement(node, svgCoords, 20, onCoordsChange);

  return node;
};
