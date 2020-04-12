import * as d3 from 'd3';
import svgHandler, { SvgHandler } from './svg/svgHandler';

type Graph = {
  name: string;
  sayName(): string;
};

const graph = (n: string): Graph => {
  const k = {
    name: n,
    sayName() {
      return n;
    },
  };
  return k;
};

const svgInstance: SvgHandler = new (svgHandler as any)('#d3-canvas');
svgInstance.drawBackground();

const circles = [
  { cx: 100, cy: 60, label: '00' },
  { cx: 189, cy: 60, label: '01' },
  { cx: 278, cy: 60, label: '02' },
  { cx: 367, cy: 60, label: '03' },
];

circles.forEach((circle) => {
  svgInstance.drawCircle({ ...circle, r: 10 });
});

const cys = d3.selectAll('.y-circle');

cys.call(
  d3
    .drag()
    .on('start', () => console.log('strated'))
    .on('end', () => console.log('ended'))
);
