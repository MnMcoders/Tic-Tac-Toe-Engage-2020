import { Component, OnInit, Input} from '@angular/core';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'
import { Tree, Node } from './node';


@Component({
  selector: 'app-nine-xnine',
  templateUrl: './nine-xnine.component.html',
  styleUrls: ['./nine-xnine.component.css']
})
export class NineXnineComponent implements OnInit {
  @Input() public playerData;
  @Input() public gameData;

  public currentPlayer:Playerenum;
  public currentPlayerMove:Cellenum;
  public board : Cellenum[][][];
  public isGameOver: boolean;
  public statusMessage;
  public boardsWonHuman : number[][];
  public boardsWonMachine : number[][];
  public boardAvailable : boolean[][];
  public nextCell=[];
  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){

    this.board=[];
    this.boardAvailable=[];
    this.boardsWonHuman=[];
    this.boardsWonMachine=[];
    for(let row=0;row<3;row++)
    {
      this.board[row]=[];
      this.boardAvailable[row] = [];
      this.boardsWonHuman[row] = [];
      this.boardsWonMachine[row] = [];
      for(let col=0;col<3;col++)
      {
        this.boardAvailable[row][col] = true;
        this.boardsWonHuman[row][col] = 0;
        this.boardsWonMachine[row][col] = 0;
        this.board[row][col]=[];
        for(let pos=0;pos<9;pos++)
        {
          this.board[row][col][pos] = Cellenum.EMPTY;
        }
      }
    }
    

    this.currentPlayerMove = Cellenum.X; 
    if(this.playerData=="machine")this.currentPlayer = Playerenum.c;
    if(this.playerData=="human")this.currentPlayer = Playerenum.h;
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    if(this.currentPlayer===Playerenum.c)this.moveComputer(1,1);
  }
  move(row:number, col:number, pos:number){
    console.log(row);
    console.log(col);
    console.log(pos);
    if(!this.isGameOver && this.board[row][col][pos]==Cellenum.EMPTY){
        this.board[row][col][pos] = this.currentPlayerMove;
        document.getElementById((row+"."+col+"."+pos)).innerHTML = this.currentPlayerMove;
        console.log(this.currentPlayerMove);
    }
      if(this.isDrawGame()){
        this.statusMessage = 'It\'s a Draw!';
        this.isGameOver = true;
      }else if(this.isWinGame()){
        this.statusMessage = `Player ${this.currentPlayer} won!`;
        this.isGameOver = true;
      }else{
        this.currentPlayer = Playerenum.c;
        this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
        this.statusMessage =`Player ${this.currentPlayer}'s turn`;
      }
      this.nextCell = this.calculateNextCell(pos);
      if(!this.isGameOver)this.moveComputer(this.nextCell[0],this.nextCell[1]);
  }
  /*board[row][col][pos]: pos -> 1 to 9*/
  /*Function to tell if smaller board at (row,col) is won*/
  calculateNextCell(pos:number):any{
    switch(pos)
    {
      case 0:
        return [0,0];
      case 1:
        return [0,1];
      case 2:
        return [0,2];
      case 3:
        return [1,0];
      case 4:
        return [1,1];
      case 5:
        return [1,2];
      case 6:
        return [2,0];
      case 7:
        return [2,1];
      case 8:
        return [2,2];
                                                  
    }
  }

  moveComputer(row:number,col:number){
    for(let pos=0;pos<9;pos++)
    {
      if(this.board[row][col][pos]==Cellenum.EMPTY)
      {
          //Monte Carlo Search Tree Function Comes Here
          this.board[row][col][pos] = this.currentPlayerMove;
          this.nextCell = this.calculateNextCell(pos);
          this.MCTS(this.board,false,row,col,pos);
          document.getElementById(row+"."+col+"."+pos).innerHTML = this.currentPlayerMove;
          break;
      }
    }

    if(this.isDrawGame()){
      this.statusMessage = 'It\'s a Draw!';
      this.isGameOver = true;
    }else if(this.isWinGame()){
      this.statusMessage = `Player ${this.currentPlayer} won!`;
      this.isGameOver = true;
    }else{
      this.currentPlayer = Playerenum.h;
      this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
      this.statusMessage =`Player ${this.currentPlayer}'s turn`;
    }
    
  }

  rootNode: Tree;
  currNode: Node;
  childNode: Node;
  selectedChildNode: Node;
  nodeToExplore: Node;
  simulationResult: number;
  bestValue: number;
  UCTValue: number;
  iterator: number;
//For finding UCT Value
  totalVisit: number;
  nodeWinScore: number;
  nodeVisit:number;
  MCTS(board:Cellenum[][][],isMachine:boolean,row:number,col:number,pos:number){  
    this.nextCell = this.calculateNextCell(pos);
    this.setNodeState(this.rootNode.root,row,col,pos);
    for(let i=0;i<9;i++)
    {
      if(board[this.nextCell[0]][this.nextCell[1]][i]==Cellenum.EMPTY){
          this.setNodeState(this.childNode,this.nextCell[0],this.nextCell[1],i);
          this.rootNode.root.children.push(this.childNode);
      }
    }
    this.currNode = this.MCTSSelectNode(this.rootNode);
    if(this.currNode!=this.checkIfLeafNode())
    {
      this.MCTSExpandNode(this.currNode);
    }
    this.nodeToExplore = this.currNode;
    this.simulationResult = this.MCTSSimulate(this.nodeToExplore);
    this.MCTSUpdate(this.nodeToExplore,this.simulationResult);
  }

  //MCTS Algo Functions
  MCTSSelectNode(rootNode:Tree):any{
    this.iterator = 0;
    while(this.iterator!=rootNode.root.children.length){
      this.UCTValue = this.getUCTValue();
      if(this.UCTValue>this.bestValue)
      {
        this.bestValue = this.UCTValue;
        this.selectedChildNode = rootNode.root.children[this.iterator];
      }
      this.iterator++;
    }
  }
  getUCTValue():any{
    if(this.nodeVisit==0)return 2147483647;

    return (this.nodeWinScore/this.nodeVisit) + (1.41*(Math.sqrt(Math.log(this.totalVisit))))/(this.nodeVisit)
  }

  MCTSExpandNode(currNode:Node):any{
    
  }

  MCTSSimulate(nodeToExplore:Node):any{
    
  }

  MCTSUpdate(nodeToExplore:Node,simulationResult:number):any{
    
  }

  //MCTS Helper Functions
  setNodeState(settingNode:Node,row:number,col:number,pos:number){
    settingNode.currentState.row = row;
    settingNode.currentState.col = col;
    settingNode.currentState.pos = pos;
    settingNode.currentState.isVisited = true;
  }
  checkIfLeafNode():any{
    
  }






  isWinBoard(row:number,col:number):boolean{
    //Horizontal 
    for(let pos = 0 ; pos < 9 ; pos+=3){
      if(this.board[row][col][pos]== this.board[row][col][pos+1] && this.board[row][col][pos+1]== this.board[row][col][pos+2] && this.board[row][col][pos]!=Cellenum.EMPTY){
        /*Add win to corresponsing player*/
        if(this.currentPlayer==Playerenum.h) this.boardsWonHuman[row][col]=1;
        else this.boardsWonMachine[row][col]=1;
        this.boardAvailable[row][col] = false;
        return true;
      }
    }

    //Vertical 
    for(let pos = 0 ; pos < 3 ; pos++){
      if(this.board[row][col][pos]== this.board[row][col][pos+3] && this.board[row][col][pos+3]== this.board[row][col][pos+6] && this.board[row][col][pos]!=Cellenum.EMPTY){
        if(this.currentPlayer==Playerenum.h) this.boardsWonHuman[row][col]=1;
        else this.boardsWonMachine[row][col]=1;
        this.boardAvailable[row][col] = false;
        return true;
      }
    }

    //Diagonal
    if(this.board[row][col][0]== this.board[row][col][4] && this.board[row][col][4]== this.board[row][col][8] && this.board[row][col][0]!=Cellenum.EMPTY){
      if(this.currentPlayer==Playerenum.h) this.boardsWonHuman[row][col]=1;
        else this.boardsWonMachine[row][col]=1;
      this.boardAvailable[row][col] = false;
      return true;
    }
    if(this.board[row][col][2]== this.board[row][col][4] && this.board[row][col][4]== this.board[row][col][6] && this.board[row][col][2]!=Cellenum.EMPTY){
      if(this.currentPlayer==Playerenum.h) this.boardsWonHuman[row][col]=1;
        else this.boardsWonMachine[row][col]=1;
      this.boardAvailable[row][col] = false;
      return true;    
      
    }

    return false;
  }


  isWinGame(){
    let tempBoard:number[][];
    if(this.currentPlayer = Playerenum.h) tempBoard = this.boardsWonHuman;
    else tempBoard = this.boardsWonMachine;

    //Horizontal
    for(let row = 0 ; row < 3 ; row ++){
      if(tempBoard[row][0]==tempBoard[row][1] && tempBoard[row][1]==tempBoard[row][2] && tempBoard[row][0]==1){
        this.isGameOver = true;
        return true;
      }
    }

    //Vertical 
    for(let col = 0 ; col < 3 ; col ++){
      if(tempBoard[0][col]==tempBoard[1][col] && tempBoard[2][col]==tempBoard[1][col] && tempBoard[0][col]==1){
        this.isGameOver = true;
        return true;
      }
    }

    //Diagonal
    if(tempBoard[0][0]==tempBoard[1][1] && tempBoard[2][2]==tempBoard[1][1] && tempBoard[0][0]==1){
      this.isGameOver = true;
      return true;
    }

    if(tempBoard[0][2]==tempBoard[1][1] && tempBoard[2][0]==tempBoard[1][1] && tempBoard[0][2]==1){
      this.isGameOver = true;
      return true;
    }

    return false;
  }


  isDrawBoard(row:number,col:number): boolean {
    for(let pos = 0; pos < 9 ; pos++){
      if(this.board[row][col][pos]!= Cellenum.EMPTY) return false;
    }
    if(!this.isWinBoard(row,col)){
      this.boardAvailable[row][col] = false;
      this.boardsWonHuman[row][col] = 2;
      this.boardsWonMachine[row][col] = 2;
      return true;
    }
    return false;
  }

  isDrawGame(){
    for(let row = 0;row < 3 ; row++){
      for(let col = 0; col < 3;col++){
        if(this.boardAvailable[row][col]==true) return false;
      }
    }
    return !this.isWinGame();
  }

}
