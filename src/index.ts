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

const e = graph('Test');
const result = document.createElement('div');
result.innerHTML = e.sayName();
document.body.append(result);
