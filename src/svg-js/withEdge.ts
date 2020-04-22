export type Points = [[number, number], [number, number]];

export default function withEdge(draw: any, points: Points) {
  const segment = draw.line(points);
  return {
    draw() {
      segment.stroke({
        color: '#0095ff',
        width: 2,
        linecap: 'round',
        opacity: 0.5,
      });
    },
    update(nPoints: Points) {
      segment.animate(1000).plot(nPoints);
    },
    segment,
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
