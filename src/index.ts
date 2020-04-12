import * as d3 from 'd3';
import initSVG from './svg-js/init';

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

initSVG();
