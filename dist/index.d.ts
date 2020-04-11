declare type Graph = {
    name: string;
    sayName(): string;
};
declare const graph: (n: string) => Graph;
declare const e: Graph;
