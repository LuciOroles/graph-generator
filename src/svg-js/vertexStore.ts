import { Vertex, Segment, CartesianCoords } from './init';
import { Coords } from './createVertex';
import withEdge from './withEdge';

type Edge = {
  name: string;
  coords: [number, number];
};

type AddVertex = {
  name: string;
  coords: CartesianCoords;
};

type VertexStore = {
  vertices: Vertex[];
  addVertex(name: string, coords: CartesianCoords): AddVertex;
  getItem(vertex: string): Vertex[];
  updateVertex(vertex: string, coords: Coords): void;
  getCoords(vertex: number | string): [number, number];
  drawnEdges: string[];
  drawnSegments: Segment[];
  drawEdge(starEdge: Edge, endEdge: Edge): void;
};

export default function vertexStore(draw: any): VertexStore {
  return {
    vertices: [],
    addVertex(name: string, coords: CartesianCoords): AddVertex {
      const v = {
        name,
        coords,
      };

      this.vertices.push(v);

      return v;
    },
    updateVertex(vertex: string, coords: Coords) {
      this.vertices.forEach((cV: Vertex) => {
        if (cV.name === vertex) {
          cV.coords = coords;
        }
      });
    },
    getItem(vertexName: string) {
      return this.vertices.filter((cV: Vertex) => {
        return cV.name === vertexName;
      });
    },
    getCoords(vertex: number | string): [number, number] {
      if (typeof vertex === 'number') {
        const { x, y } = this.vertices[vertex].coords;
        return [x, y];
      }
      if (typeof vertex === 'string') {
        const eligible = this.getItem(vertex);
        if (eligible.length === 1) {
          const { x, y } = eligible[0].coords;
          return [x, y];
        }
      }
      throw Error('search by VALID vertex name or index');
    },
    drawnEdges: [],
    drawnSegments: [],
    drawEdge(startEdge: Edge, endEdge: Edge) {
      const painter = withEdge(draw, [startEdge.coords, endEdge.coords]);
      const edges = [startEdge.name, endEdge.name];
      console.log('drawing edge ', [startEdge.coords, endEdge.coords]);

      painter.draw();
      this.drawnEdges.push(edges);
      this.drawnSegments.push({
        line: painter.segment,
        edges,
        coords: {
          startEdge: startEdge.coords,
          endEdge: endEdge.coords,
        },
      });
    },
  };
}
