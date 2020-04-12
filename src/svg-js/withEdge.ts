export type Points = [[number, number], [number, number]];

export default function withEdge(draw: any, points: Points) {
  const line = draw.line(points);
  return {
    draw() {
      line.stroke({ color: '#0095ff', width: 2, linecap: 'round' });
    },
    update(nPoints: Points) {
      line.animate(1000).plot(nPoints);
    },
  };
}

export const groupInPairs = (array: any[]) => {
  return array.reduce((accumulator, current, idx) => {
    if (idx % 2 === 0) {
      const r = [current];
      accumulator.push(r);
    } else {
      accumulator[accumulator.length - 1].push(current);
    }
    return accumulator;
  }, []);
};
