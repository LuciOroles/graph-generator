import { SVG } from '@svgdotjs/svg.js';
import { createNamedNode, Coords } from './createVertex';
import withEdge, { groupInPairs, Points } from './withEdge';

type Vertex = {
  name: string;
  coords: {
    x: number;
    y: number;
  };
};

type VertexStore = {
  current: number;
  vertices: Vertex[];
  addVertex(): void;
  updateVertex(index: number, coords: Coords): void;
  getCoords(index: number): [number, number];
};

export default function () {
  var appendNode = document.createElement('button');
  const stateLog = document.createElement('div');

  var draw = SVG().addTo('#canvas').size(600, 400);

  var vertexStore: VertexStore = {
    current: 0,
    vertices: [],
    addVertex() {
      this.vertices.push({
        name: 'N' + this.current,
        coords: {
          x: 0,
          y: 0,
        },
      });
    },
    updateVertex(index: number, coords: Coords) {
      this.vertices[index].coords = coords;
      // temp to check coors
      const vertexCoords = this.vertices.map((vertex: Vertex, i: number) =>
        this.getCoords(i)
      );

      groupInPairs(vertexCoords).forEach((points: Points) => {
        if (points.length > 1) withEdge(draw, points).draw();
      });

      stateLog.innerText =
        JSON.stringify(vertexCoords) +
        ' || ' +
        JSON.stringify(groupInPairs(vertexCoords));
      // segements drawned --> segements to update
    },
    getCoords(index: number): [number, number] {
      const { x, y } = this.vertices[index].coords;

      return [x, y];
    },
  };

  appendNode.setAttribute('type', 'button');
  appendNode.innerText = 'Add Node';

  appendNode.addEventListener('click', (_evt) => {
    const { current } = vertexStore;
    const coordsChange = (newCoords: Coords) => {
      vertexStore.updateVertex(current, newCoords);
    };
    createNamedNode(
      draw,
      blueNodeFactory(20, 100),
      'N' + current,
      svgCoords,
      coordsChange
    );
    vertexStore.addVertex();
    vertexStore.current += 1;
  });

  const svgCoords: ClientRect = document
    .getElementsByTagName('svg')[0]
    .getBoundingClientRect();

  const blueNodeFactory = (x: number, y: number) => {
    return {
      radius: 20,
      color: '#0095ff',
      startPos: {
        x,
        y,
      },
    };
  };

  document.getElementById('content').appendChild(appendNode);
  document.getElementById('content').appendChild(stateLog);
}
