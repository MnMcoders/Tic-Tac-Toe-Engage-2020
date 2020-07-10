export class Node {
    public parent: Node;
    public player: number;
    public nodeWinScore: number;
    public currentState: State;
    public numberOfWins : number;
    public numberOfTimesVisited : number;
    public children: Node[];

    constructor(parent:Node,player:number,currentState:State,children:Node[]){
        this.player = player;
        this.parent = parent;
        this.currentState = currentState;
        this.children = children;
        this.numberOfTimesVisited = 0;
        this.numberOfWins = 0;
    }

    setNodeWinScore(value:number){
        this.nodeWinScore = value;
    }

    incrementWinScore(){
        this.numberOfWins++;
    }

    incrementVisits(){
        this.numberOfTimesVisited++;
    }

    setState(row:number,col:number,pos:number){
        this.currentState = new State(row,col,pos);
    }
}
export class Tree{
   public root: Node; 
   constructor(root:Node){
       this.root = root;
   }
}
export class State{
    public row: number;
    public col: number;
    public pos: number;
    constructor(row:number,col:number,pos:number){
        this.col =col;
        this.row = row;
        this.pos = pos;
    }
}