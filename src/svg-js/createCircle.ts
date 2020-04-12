/**
 * create a circle movable inside a drawing context
 * @param {draw} svg element to append to
 * @param {CircleConfig} circleConfig
 * @param {ClientRect} svgCoords
 */

type CircleConfig = {
  radius: number;
  color: string;
  startPos: {
    x: number;
    y: number;
  };
};

export default function createCircle(
  draw: any,
  circleConfig: CircleConfig,
  svgCoords: ClientRect
) {
  const { startPos } = circleConfig;
  // init
  var circle = draw
    .circle(circleConfig.radius * 2)
    .attr({ fill: circleConfig.color });
  circle.move(startPos.x, startPos.y);

  const inConstrains = (
    svgCoords: ClientRect,
    evt: MouseEvent,
    gap: number
  ) => {
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
  const dragCicle = (element: any) => {
    const movingCircle = (evt: MouseEvent) => {
      const { radius } = circleConfig;
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
      element.on('mousemove', movingCircle);
    });

    element.on('mouseup', () => {
      element.off('mousemove');
    });
  };

  dragCicle(circle);
}
