import { Cellenum } from '../cell/cellenum.enum';

export class Node{
    state:State;
    parent:Node;
    children:Array<Node>;
    isVisited:boolean;
    constructor(state:State,parent:Node,children:Array<Node>){
        this.children=children;
        this.parent = parent;
        this.state = state;
        this.isVisited = false;
    }

    //Getter and Setter
    getIsVisited():boolean{
        return this.isVisited;
    }

    setIsVisited(){
        this.isVisited = true;
    }

    getState():State{
        return this.state;
    }
    setState(state:State){
        this.state = state;
    }
    getParent(){
        return parent;
    }
    setParent(parent:Node){
        this.parent = parent;
    }
    getChildren():Array<Node>{
        return this.children;
    }
    setChildren(children:Array<Node>){
        this.children = children;
    }
}


export class State{
    move:number[];  //Move to come to this state : row col pos
    board:Board;
    playerNo:number; /* -1->Human 1->Machine -> Who will make next move*/
    playerMove:Cellenum; /* X or O -> Who will make next move*/
    visitCount:number;
    winScore:number;
    isTerminal:boolean;
    

    constructor(move:number[],board:Board,playerNo:number,playerMove:Cellenum,terminal:boolean){
        this.move = move;
        this.board = board;
        this.playerNo=playerNo;
        this.playerMove = playerMove;
        this.visitCount =0;
        this.winScore =0;
        this.isTerminal = terminal ;
        
    }

}


export class Board{
    board:Cellenum[][][];
    boardStatus:number[][];

    constructor(board:Cellenum[][][],boardStatus:number[][]){
        this.board = board;
        this.boardStatus = boardStatus;
    }
    
}