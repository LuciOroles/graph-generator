import * as d3 from 'd3';

/**
 * initalize the svg based on selector
 *  exposes fn that will draw data into the canvas
 *
 * @export
 * @param {String} selector css selector of the target
 * @returns {
 *  @drawBackground {function}
 *  @drawSegment {function}
 *  @drawCircle {function}
 * }
 */

type Circle = {
  cx: number;
  cy: number;
  r: number;
  color?: string;
};

type Point = {
  cx: number;
  cy: number;
};

export type SvgHandler = {
  svgContainer: object;
  drawBackground: Function;
  drawSegment: Function;
  drawCircle: Function;
  drawText: Function;
};

export default function svgHandler(selector: string): SvgHandler {
  this.svgContainer = d3
    .select(selector)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '500px');

  this.drawBackground = () => {
    this.svgContainer
      .append('rect')
      .attr('x', 10)
      .attr('y', 10)
      .attr('width', '100%')
      .attr('height', 490)
      .attr('fill', '#444444');
  };

  this.drawSegment = ([a, b]: [Point, Point]) => {
    this.svgContainer
      .append('line')
      .attr('x1', a.cx)
      .attr('y1', a.cy)
      .attr('x2', b.cx)
      .attr('y2', b.cy)
      .attr('stroke', 'white');
  };
  this.drawCircle = (circle: Circle) => {
    this.svgContainer
      .append('circle')
      .attr('cx', circle.cx)
      .attr('cy', circle.cy)
      .attr('r', circle.r)
      .attr('fill', circle.color || 'yellow')
      .attr('class', 'y-circle');
  };
  this.drawText = (circle: Circle, value: string) => {
    this.svgContainer
      .append('text')
      .attr('x', circle.cx - circle.r / 3)
      .attr('y', circle.cy + circle.r / 3)
      .attr('fill', 'red')
      .text(value);
  };

  return this;
}
