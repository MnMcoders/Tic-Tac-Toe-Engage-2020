export class Node {
    parent: Node;
    player: number;
    nodeWinScore: number;
    currentState: State;
    numberOfWins : number;
    numberOfTimesVisited : number;
    children: Node[];
}
export class Tree{
   root: Node; 
}
export class State{
    row: number;
    col: number;
    pos: number;
    isVisited: boolean;
}