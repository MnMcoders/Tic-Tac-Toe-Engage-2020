import { Component, OnInit, Input} from '@angular/core';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'
import { Tree, Node, State } from './node';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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
  public boardStatus:number[][]; /* 0 -> Empty ; 1 -> Machine won ; -1 -> Human won ; 2 -> Draw */
  public nextCell=[];
  public bestMove=[];
  public isWinner;
  public available=[];
  public tempBoard: Cellenum[][][];
  public tempBoardStatus: number[][];
  //MCTS Variables
  rootNode:Tree;
  currNode: Node;
  childNode: Node;
  selectedChildNode: Node;
  nodeToExplore: Node;
  expandChildNode: Node;
  winnerNode: Node;
  bestChildNode: Node;
  nextNode: Node;
  tempNode: Node;
  simulationResult: number;
  bestValue: number;
  UCTValue: number;
  iterator: number;
  count: number;
//For finding UCT Value
  totalVisit: number;
  nodeVisit:number;
  
  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.board=[];
    this.boardStatus=[];
    for(let row=0;row<3;row++)
    {
      this.board[row]=[];
      this.boardStatus[row] = [];
      for(let col=0;col<3;col++)
      {
        this.boardStatus[row][col] = 0;
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
    //this.currentPlayer = Playerenum.c;
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    /*Computers First Move at Center of board*/
    if(this.currentPlayer === Playerenum.c)this.moveComputer(1,1,4);
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
      //TODO - Rectify the errors -- need to include win board and draw board
    if(this.isDrawBoard(row,col,this.board,this.boardStatus,this.currentPlayer)|| this.isWinBoard(row,col,this.board,this.boardStatus,this.currentPlayer)){
      if(this.isDrawGame(this.boardStatus)){
        this.statusMessage = 'It\'s a Draw!';
        this.isGameOver = true;
      }else if(this.isWinGame(this.boardStatus)){
        this.statusMessage = `Player ${this.currentPlayer} won!`;
        this.isGameOver = true;
      }
    }
    else{
      this.currentPlayer = Playerenum.h;
      this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
      this.statusMessage =`Player ${this.currentPlayer}'s turn`;
    }
    // TODO - what if next board is full ?
    if(!this.isGameOver)this.moveComputer(row,col,pos);
}

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

  moveComputer(row:number,col:number,pos:number){
    this.bestMove = [-1,-1,-1];
    this.nextCell = this.calculateNextCell(pos);
    this.rootNode = new Tree(new Node(null,1,new State(row,col,pos),[]))
    this.bestMove = this.MCTS(this.nextCell[0],this.nextCell[1]);
    console.log(this.bestMove);
    document.getElementById(this.bestMove[0]+"."+this.bestMove[1]+"."+this.bestMove[2]).innerHTML = this.currentPlayerMove;
  
    /* This part of move computer I have changed */
   if(this.isDrawBoard(row,col,this.board,this.boardStatus,this.currentPlayer)|| this.isWinBoard(row,col,this.board,this.boardStatus,this.currentPlayer)){
    if(this.isDrawGame(this.boardStatus)){
      this.statusMessage = 'It\'s a Draw!';
      this.isGameOver = true;
    }else if(this.isWinGame(this.boardStatus)){
      this.statusMessage = `Player ${this.currentPlayer} won!`;
      this.isGameOver = true;
    }
  }
  else{
    this.currentPlayer = Playerenum.h;
    this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
    this.statusMessage =`Player ${this.currentPlayer}'s turn`;
  }
 
}

  MCTS(row:number,col:number){  
    this.count = 3;
    while(this.count>0){
      for(let i=0;i<9;i++)
      {
        if(this.board[row][col][i]==Cellenum.EMPTY){
            this.childNode = new Node(this.rootNode.root,0,new State(this.nextCell[0],this.nextCell[1],i),[]);
            this.rootNode.root.children.push(this.childNode);
        }
      }
      this.currNode = this.MCTSSelectNode(this.rootNode);
      console.log("Before Expand");
      console.log(this.currNode);
      this.MCTSExpandNode();
      console.log("After Expand");
      console.log(this.currNode);
      this.nodeToExplore = this.currNode;
      this.simulationResult = this.MCTSSimulate(this.nodeToExplore);
      
      this.count--;
    }
    this.winnerNode = this.getBestChildNode(this.rootNode.root);
    return [this.winnerNode.currentState.row,this.winnerNode.currentState.col,this.winnerNode.currentState.pos];
  }

  //MCTS Algo Functions
  MCTSSelectNode(rootNode:Tree):Node{
    this.iterator = 0;
    this.bestValue = -Infinity;
    while(this.iterator!=rootNode.root.children.length){
      this.UCTValue = Math.fround(this.getUCTValue(rootNode.root.children[this.iterator]));
      rootNode.root.children[this.iterator].nodeWinScore = this.UCTValue;
      if(this.UCTValue>this.bestValue)
      {
        this.bestValue = this.UCTValue;
        this.selectedChildNode = rootNode.root.children[this.iterator];
      }
      this.iterator++;
    }
    console.log("selected");
    console.log(this.selectedChildNode);
    return this.selectedChildNode;
  }

  getUCTValue(child:Node):any{
    if(child.numberOfTimesVisited==0)return 2147483647;
    return Math.fround(child.numberOfWins/child.numberOfTimesVisited) + Math.fround((1.41*(Math.sqrt(Math.log(this.totalVisit))))/(child.numberOfTimesVisited))
  }


  MCTSExpandNode():any{
    console.log(this.currNode);
    this.nextCell = this.calculateNextCell(this.currNode.currentState.pos);
    for(let i=0;i<9;i++)
    {
      if(this.board[this.nextCell[0]][this.nextCell[1]][i]==Cellenum.EMPTY){
          this.expandChildNode = new Node(this.currNode,1,new State(this.nextCell[0],this.nextCell[1],i),[]);
          this.currNode.children.push(this.expandChildNode);
      }
    }
  }
   
 MCTSSimulate(node:Node):any{
  this.tempBoard = this.board;
  this.tempBoardStatus = this.boardStatus;
  console.log(node);
  this.tempNode = node.children[0];
  console.log("HI");
  console.log(this.tempNode);
  this.tempNode.incrementVisits();
  let simulationValue;

  if(this.isTerminalState(this.tempBoard,this.tempBoardStatus)==0){
    this.nextNode = this.randomPlay();
    //if(this.nextNode==null)break;
    this.tempNode = this.nextNode.children[0];
  }

  if(this.isTerminalState(this.tempBoard,this.tempBoardStatus)==2){
     simulationValue = 0; //Draw
  }
  else{
  simulationValue =this.isTerminalState(this.tempBoard,this.tempBoardStatus);
   /* 1 if Machine wins and -1 if human wins*/ 
  /* Current Node will be the terminal node*/}
  return this.MCTSUpdate(this.tempNode,simulationValue);
 }
 randomPlay():Node{
    //Making Availablle Empty Cells Array
    console.log("yeeee");
    console.log(this.tempNode);
    let childTempNode: Node;
    this.nextCell = this.calculateNextCell(this.tempNode.currentState.pos);
    console.log(this.nextCell);  this.tempBoardStatus = this.boardStatus;
    this.tempBoardStatus = this.boardStatus;
    for(let i=0;i<9;i++)
    {
      if(this.tempBoard[this.nextCell[0]][this.nextCell[1]][i]==Cellenum.EMPTY){
          this.available.push(i);
      }
    }
    if(this.available.length==0)return null;
    //Selecting Random Child and Making the Move
    this.shuffle(this.available);
    let len = this.available.length;
    if(len==0)
    {
      if(this.tempNode.player==0){
        this.isWinBoard(this.nextCell[0],this.nextCell[1],this.tempBoard,this.tempBoardStatus,Playerenum.h);
        this.isDrawBoard(this.nextCell[0],this.nextCell[1],this.tempBoard,this.tempBoardStatus,Playerenum.h);
      }
      if(this.tempNode.player==1){
        this.isWinBoard(this.nextCell[0],this.nextCell[1],this.tempBoard,this.tempBoardStatus,Playerenum.c);
        this.isDrawBoard(this.nextCell[0],this.nextCell[1],this.tempBoard,this.tempBoardStatus,Playerenum.c);
      }
      return null;
    }
    console.log("I'm Avaialble");
    console.log(this.available);
    let p = this.available[0];
    if(this.tempNode.player==0){
      this.tempBoard[this.nextCell[0]][this.nextCell[1]][p]==Cellenum.X;
      childTempNode = new Node(this.tempNode,1,new State(this.nextCell[0],this.nextCell[1],p),[]);
    }
    if(this.tempNode.player==1){
      this.tempBoard[this.nextCell[0]][this.nextCell[1]][p]==Cellenum.O;
      childTempNode = new Node(this.tempNode,0,new State(this.nextCell[0],this.nextCell[1],p),[]);
    }

    this.tempNode.children.push(childTempNode);
    while(this.available.length>0)
    {
      this.available.pop();
    }
    return this.tempNode;
 }
 shuffle(array: number[]){
    let currentIndex = array.length, temporaryValue :number , randomIndex : number;
    while(currentIndex!=0){
       
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
 isTerminalState(board:Cellenum[][][],boardStatus:number[][]):number{
   if(this.isWinGame(boardStatus)){
     return 1;
   }
   else if(this.isDrawGame(boardStatus)){
     return 2;
   }
   else return 0;
 }


  MCTSUpdate(nodeToExplore:Node,simulationResult:number):any{
    //Add Simulation Result
    let currentNode = nodeToExplore;
    while(currentNode.parent!=null){
      if(this.simulationResult===1)currentNode.numberOfWins+=simulationResult;
      currentNode = currentNode.parent;
    }
  } 


  getBestChildNode(rootNode:Node):Node{
    this.iterator = 0;
    this.bestValue = -2;
    while(this.iterator!=rootNode.children.length)
    {
      if(this.bestValue<rootNode.children[this.iterator].nodeWinScore){
        this.bestValue = rootNode.children[this.iterator].nodeWinScore;
        this.bestChildNode = rootNode.children[this.iterator];
      }
      this.iterator++;
    }
    return this.bestChildNode;
  }

  checkIfLeafNode(node:Node):any{
    if(node.children.length ===0) return true;
    return false;
  }





/*board[row][col][pos]: pos -> 1 to 9*/
 /*Function to tell if smaller board at (row,col) is won*/
 isWinBoard(row:number,col:number,board:Cellenum[][][],boardStatus:number[][],currentPlayer:Playerenum):boolean{
  //Horizontal
  for(let pos = 0 ; pos < 9 ; pos+=3){
    if(board[row][col][pos]== board[row][col][pos+1] && board[row][col][pos+1]== board[row][col][pos+2] && board[row][col][pos]!=Cellenum.EMPTY){
      /*Add win to corresponsing player*/
      if(currentPlayer==Playerenum.h)boardStatus[row][col]=-1;
      else boardStatus[row][col]=1;
      return true;
    }
  }

  //Vertical
  for(let pos = 0 ; pos < 3 ; pos++){
    if(board[row][col][pos]== board[row][col][pos+3] && board[row][col][pos+3]== board[row][col][pos+6] && board[row][col][pos]!=Cellenum.EMPTY){
      if(currentPlayer==Playerenum.h)boardStatus[row][col]=-1;
      else boardStatus[row][col]=1;
      return true;
    }
  }

  //Diagonal
  if(board[row][col][0]== board[row][col][4] && board[row][col][4]== board[row][col][8] && board[row][col][0]!=Cellenum.EMPTY){
    if(currentPlayer==Playerenum.h)boardStatus[row][col]=-1;
    else boardStatus[row][col]=1;
    return true;
  }
  if(board[row][col][2]== board[row][col][4] && board[row][col][4]== board[row][col][6] && board[row][col][2]!=Cellenum.EMPTY){
    if(currentPlayer==Playerenum.h)boardStatus[row][col]=-1;
    else boardStatus[row][col]=1;
    return true;   
   
  }

  return false;
}

 isWinGame(boardStatus:number[][]){
  //Horizontal
  for(let row = 0 ; row < 3 ; row ++){
    if(boardStatus[row][0]==boardStatus[row][1] && boardStatus[row][1]==boardStatus[row][2] && (boardStatus[row][0]==1|| boardStatus[row][0]==-1)){
      this.isWinner = boardStatus[row][0];
      this.isGameOver = true;
      return true;
    }
  }

  //Vertical
  for(let col = 0 ; col < 3 ; col ++){
    if(boardStatus[0][col]==boardStatus[1][col] && boardStatus[2][col]==boardStatus[1][col] && boardStatus[0][col]==1){
      this.isWinner = boardStatus[0][col];
      this.isGameOver = true;
      return true;
    }
  }

  //Diagonal
  if(boardStatus[0][0]==boardStatus[1][1] && boardStatus[2][2]==boardStatus[1][1] && boardStatus[0][0]==1){
    this.isWinner = boardStatus[0][0]
    this.isGameOver = true;
    return true;
  }

  if(boardStatus[0][2]==boardStatus[1][1] && boardStatus[2][0]==boardStatus[1][1] && boardStatus[0][2]==1){
    this.isWinner = boardStatus[0][2]
    this.isGameOver = true;
    return true;
  }

  return false;
}


isDrawBoard(row:number,col:number,board:Cellenum[][][],boardStatus:number[][],currentPlayer:Playerenum): boolean {
  for(let pos = 0; pos < 9 ; pos++){
    if(board[row][col][pos]!= Cellenum.EMPTY) return false;
  }
  if(!this.isWinBoard(row,col,board,boardStatus,currentPlayer)){
    boardStatus[row][col] = 2;
    return true;
  }
  return false;
}

isDrawGame(boardStatus:number[][]){
  for(let row = 0;row < 3 ; row++){
    for(let col = 0; col < 3;col++){
      if(boardStatus[row][col]==0) return false;
    }
  }
  return !this.isWinGame(boardStatus);
}



  
  
 
}
