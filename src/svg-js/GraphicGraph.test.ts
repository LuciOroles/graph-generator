type Vertex = {
  coords: {
    x: number;
    y: number;
  };
};

type Edge = {
  start: Vertex;
  end: Vertex;
};

type EdgeKeys = {
  startKey: string;
  endKey: string;
};

const VertexStore: Map<string, Vertex> = new Map();
const EdgeStore: Map<EdgeKeys, Edge> = new Map();

describe('Edge store', () => {
  const v1v2 = {
    startKey: 'v1',
    endKey: 'v2',
  };
  beforeAll(() => {
    VertexStore.set('v1', { coords: { x: 1, y: 1 } });
    VertexStore.set('v2', { coords: { x: 2, y: 2 } });
    VertexStore.set('v3', { coords: { x: 3, y: 3 } });
    VertexStore.set('v4', { coords: { x: 4, y: 4 } });

    EdgeStore.set(v1v2, {
      start: VertexStore.get('v1'),
      end: VertexStore.get('v2'),
    });

    EdgeStore.set(
      {
        startKey: 'v2',
        endKey: 'v3',
      },
      {
        start: VertexStore.get('v2'),
        end: VertexStore.get('v3'),
      }
    );
  });

  test('changing coords to one vertex', () => {
    VertexStore.set('v2', { coords: { x: 2, y: 12 } });
    expect(EdgeStore.get(v1v2)).toEqual({
      x: 2,
      y: 12,
    });
  });
});
