import PubSub from 'pubsub-js';

export type Edge = {
  [key: string]: string[];
};

export type GraphI = {
  getEdges(): Edge;
  addEdge(edgeStart: string, edgeEnd: string): void;
  addVertex(vertexName: string): void;
  vertexCount(): number;
  adjacent(vertex: string): string[];
  getAdjacentTo(vertex: string): string[];
};

export type GTraversal = {
  edgeTo: string;
  marked: boolean;
};

export type GTraversalResult = {
  [key: string]: GTraversal;
};

export type GraphType = 'directed' | 'both';

export const GraphTopics = {
  addEdge: Symbol('addEdge'),
  addVertex: Symbol('addVertex'),
  vertexUpdate: Symbol('vertexUpdate'),
};

export default function Graph(type: GraphType = 'both'): GraphI {
  const edges: Edge = {};

  return {
    getEdges() {
      return edges;
    },
    addEdge(edgeStart: string, edgeEnd: string) {
      if (edges.hasOwnProperty(edgeStart) && Array.isArray(edges[edgeStart])) {
        if (!edges[edgeStart].includes(edgeEnd)) edges[edgeStart].push(edgeEnd);
      } else {
        edges[edgeStart] = [edgeEnd];
      }
      if (type === 'both') {
        if (
          Array.isArray(edges[edgeEnd]) &&
          !edges[edgeEnd].includes(edgeStart)
        ) {
          edges[edgeEnd].push(edgeStart); // avoid redundant adding for isolated vertex
        } else {
          edges[edgeEnd] = [edgeStart];
        }
      }
      if (type === 'directed' && !edges.hasOwnProperty(edgeEnd)) {
        edges[edgeEnd] = [];
      }
    },
    addVertex(vertexName: string) {
      if (!edges.hasOwnProperty(vertexName)) {
        edges[vertexName] = [];
      } else {
        throw Error(`the vertex ${vertexName} has
        already been added ${edges[vertexName]}`);
      }
    },
    vertexCount(): number {
      return Object.keys(edges).length;
    },
    adjacent(vertex: string): string[] {
      if (edges[vertex]) return edges[vertex];
      return [];
    },
    getAdjacentTo(vertex: string) {
      const Edges = this.getEdges();
      let toVertex: string[] = [];
      for (let key in Edges) {
        if (Edges.hasOwnProperty(key) && vertex !== key) {
          const pointingToVertex = Edges[key].reduce(
            (occurrenceVect: string[], adjVertex: string) => {
              if (adjVertex === vertex) {
                occurrenceVect.push(key);
              }
              return occurrenceVect;
            },
            []
          );

          if (pointingToVertex.length > 0) {
            toVertex.push(...pointingToVertex);
          }
        }
      }

      return toVertex;
    },
  };
}
