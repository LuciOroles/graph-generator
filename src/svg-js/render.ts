import PubSub from 'pubsub-js';
import { GraphTopics } from '../Graph/Graph';
import { EndOfEdge, Coords } from './createVertex';

const numericCreator = (markup: string, w: number) => {
  var numeric = document.createElement('input');
  var label = document.createElement('label');
  numeric.setAttribute('type', 'number');
  numeric.style.width = `${w}em`;
  label.innerHTML = markup;
  label.appendChild(numeric);

  return {
    label,
    numeric,
  };
};

const textInputCreator = (coords: Coords) => {
  var nodeName = document.createElement('input');
  nodeName.setAttribute('type', 'text');
  nodeName.style.width = '5em';
  nodeName.style.position = 'absolute';
  nodeName.style.top = coords.y + 'px';
  nodeName.style.left = coords.x + 'px';

  return nodeName;
};

export default function render() {
  var appendNode = document.createElement('button');
  var addEdgeButton = document.createElement('button');
  var nodeName = document.createElement('input');
  var coordsInput = [numericCreator('x:', 5), numericCreator('y:', 5)];

  nodeName.setAttribute('type', 'text');
  nodeName.style.width = '5em';

  const stateLog = document.createElement('div');

  appendNode.setAttribute('type', 'button');
  appendNode.innerText = 'Add Node';

  addEdgeButton.setAttribute('type', 'button');
  addEdgeButton.innerText = 'Add Edge';

  appendNode.addEventListener('click', (evt: Event) => {
    PubSub.publish(GraphTopics.addVertex, {
      name: nodeName.value,
      coords: {
        x: parseInt(coordsInput[0].numeric.value, 10),
        y: parseInt(coordsInput[1].numeric.value, 10),
      },
    });
  });

  var content = document.getElementById('content');
  content.appendChild(appendNode);
  content.appendChild(addEdgeButton);
  content.appendChild(stateLog);
  content.appendChild(nodeName);
  coordsInput.forEach((nrI) => {
    content.appendChild(nrI.label);
  });

  PubSub.subscribe('addEdgeTo', (msg: string, data: EndOfEdge) => {
    console.log('data ', data);
    const { top, left } = document
      .getElementById('canvas')
      .getBoundingClientRect();
    const { x, y } = data.coords;
    const edgeTo = textInputCreator({
      x: x - left + 10,
      y: y - top - 10,
    });

    edgeTo.addEventListener('keypress', (ev: KeyboardEvent) => {
      const { key } = ev;
      if (key === 'Enter') {
        document.getElementById('canvas').removeChild(edgeTo);
        PubSub.publish('removeEdgeInput', {
          node: ev.target,
          endEdge: edgeTo.value,
        });
      }
    });

    document.getElementById('canvas').appendChild(edgeTo);

    type EdgeToNode = {
      node: HTMLElement;
      endEdge: string;
    };
    PubSub.subscribe('removeEdgeInput', (msg: string, edgeTo: EdgeToNode) => {
      if (edgeTo.endEdge.length !== 0) {
        PubSub.publish(GraphTopics.addEdge, {
          edgeStart: data.label,
          edgeEnd: edgeTo.endEdge,
        });
      }
    });
  });
}
