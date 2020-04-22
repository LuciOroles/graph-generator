import PubSub from 'pubsub-js';
import { SVG } from '@svgdotjs/svg.js';

import { createNamedNode, Coords, CoordChange } from './createVertex';
import Graph, { GraphI, GraphTopics } from '../Graph/Graph';
import vertexStore from './vertexStore';
import circleConfig from './circleConfig';

import render from './render';

declare global {
  interface Window {
    vertexStore: any;
    graph: GraphI;
  }
}

export type CartesianCoords = {
  x: number;
  y: number;
};

export type Vertex = {
  name: string;
  coords: CartesianCoords;
};

export type Segment = {
  line: any;
  edges: [string, string];
  coords: {
    startEdge: [number, number];
    endEdge: [number, number];
  };
};

export default function () {
  var draw = SVG().addTo('#canvas').size(600, 400);
  const svgCoords: ClientRect = document
    .getElementsByTagName('svg')[0]
    .getBoundingClientRect();

  var graph: GraphI = Graph('both');
  const vStore = vertexStore(draw);
  window.vertexStore = vStore;
  window.graph = graph;

  PubSub.subscribe(
    CoordChange,
    (msg: string, data: { coords: Coords; label: string }) => {
      const { coords, label } = data;
      console.log('subscribe to coords ', data, ' label ', label);
      vStore.updateVertex(label, coords);
      // update lines connected to vertex
      vStore.drawnSegments.forEach((segment) => {
        const { line, edges, coords } = segment;

        if (edges.includes(label)) {
          if (edges.indexOf(label) === 0) {
            coords.startEdge = vStore.getCoords(label);
          }
          if (edges.indexOf(label) === 1) {
            coords.endEdge = vStore.getCoords(label);
          }
          line.plot([coords.startEdge, coords.endEdge]);
        }
      });
    }
  );
  const appendNodeHandler = (msg: string, data: Vertex) => {
    const { name: newVertexName } = vStore.addVertex(data.name, data.coords);
    const { x, y } = data.coords;
    createNamedNode(draw, circleConfig(7, x, y), newVertexName, svgCoords);

    graph.addVertex(newVertexName);
  };

  PubSub.subscribe(GraphTopics.addVertex, appendNodeHandler);

  PubSub.subscribe(
    GraphTopics.addEdge,
    (
      msg: string,
      data: {
        edgeStart: string;
        edgeEnd: string;
      }
    ) => {
      const { edgeEnd, edgeStart } = data;
      const vStart = vStore.getCoords(edgeStart);
      const vEnd = vStore.getCoords(edgeEnd);

      // graphic draw
      vStore.drawEdge(
        { name: edgeStart, coords: vStart },
        {
          name: edgeEnd,
          coords: vEnd,
        }
      );

      graph.addEdge(edgeStart, edgeEnd);
    }
  );

  render();
}
