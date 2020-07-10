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
  public winner;
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
    this.rootNode = new Tree(new Node(null,0,new State(1,1,0),[]))
    if(this.currentPlayer === Playerenum.c)this.moveComputer(1,1);
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
      }else if(this.isWinGame(this.boardStatus,this.winner)){
        this.statusMessage = `Player ${this.currentPlayer} won!`;
        this.isGameOver = true;
      }
    }
    else{
      this.currentPlayer = Playerenum.h;
      this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
      this.statusMessage =`Player ${this.currentPlayer}'s turn`;
    }
    this.nextCell = this.calculateNextCell(pos);
    console.log(this.nextCell);
    // TODO - what if next board is full ?
    if(!this.isGameOver)this.moveComputer(this.nextCell[0],this.nextCell[1]);
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

  moveComputer(row:number,col:number){
    this.bestMove = [-1,-1,-1];
    for(let pos=0;pos<9;pos++)
    {
      if(this.board[row][col][pos]==Cellenum.EMPTY)
      {
          //Monte Carlo Search Tree Function Comes Here
          this.bestMove = this.MCTS(this.board,row,col,pos);
          console.log(this.bestMove);
          document.getElementById(this.bestMove[0]+"."+this.bestMove[1]+"."+this.bestMove[2]).innerHTML = this.currentPlayerMove;
          break;
      }
    }

    /* This part of move computer I have changed */
   if(this.isDrawBoard(row,col,this.board,this.boardStatus,this.currentPlayer)|| this.isWinBoard(row,col,this.board,this.boardStatus,this.currentPlayer)){
    if(this.isDrawGame(this.boardStatus)){
      this.statusMessage = 'It\'s a Draw!';
      this.isGameOver = true;
    }else if(this.isWinGame(this.boardStatus,this.winner)){
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

  MCTS(board:Cellenum[][][],row:number,col:number,pos:number){  
    this.count = 3;
    while(this.count>0){
      this.nextCell = this.calculateNextCell(pos);
      console.log(this.nextCell);
      console.log(this.rootNode.root)
      this.rootNode.root.setState(row,col,pos);
      this.rootNode.root.player = 1;
      for(let i=0;i<9;i++)
      {
        if(board[this.nextCell[0]][this.nextCell[1]][i]==Cellenum.EMPTY){
            this.childNode = new Node(this.rootNode.root,0,new State(this.nextCell[0],this.nextCell[1],i),[]);
            this.rootNode.root.children.push(this.childNode);
        }
      }
      this.currNode = this.MCTSSelectNode(this.rootNode);
      console.log("Before Expand");
      console.log(this.currNode);
      this.MCTSExpandNode(this.currNode,board);
      console.log("After Expand");
      console.log(this.currNode);
      this.simulationResult = this.MCTSSimulate(this.currNode);
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
    return this.selectedChildNode;
  }

  getUCTValue(child:Node):any{
    if(child.numberOfTimesVisited==0)return 2147483647;
    return Math.fround(child.numberOfWins/child.numberOfTimesVisited) + Math.fround((1.41*(Math.sqrt(Math.log(this.totalVisit))))/(child.numberOfTimesVisited))
  }

  MCTSExpandNode(currNode:Node,board:Cellenum[][][]):any{
    console.log(currNode);
    this.nextCell = this.calculateNextCell(currNode.currentState.pos);
    for(let i=0;i<9;i++)
    {
      if(board[this.nextCell[0]][this.nextCell[1]][i]==Cellenum.EMPTY){
          this.expandChildNode = new Node(currNode,1,new State(this.nextCell[0],this.nextCell[1],i),[]);
          break;
      }
    }
    this.currNode.children.push(this.expandChildNode);
  }

   
 MCTSSimulate(nodeToExplore:Node):any{
  this.tempBoard = this.board;
  this.tempBoardStatus = this.boardStatus;
  let winner;
  this.tempNode = nodeToExplore.children[0];
  console.log("HI");
  console.log(this.tempNode);
  this.tempNode.incrementVisits();
  while(this.isTerminalState(this.tempBoard,this.tempBoardStatus,winner)==0){
    /*this.nextNode = this.getBestChildNode(currentNode);
    this.nextNode.incrementVisits();
    currentNode = this.nextNode;*/
    this.nextNode = this.randomPlay(this.tempNode);
    if(this.nextNode==null)break;
    this.tempNode = this.nextNode.children[0];
  }
  let simulationResult;
  if(this.isTerminalState(this.tempBoard,this.tempBoardStatus,winner)==2){
     simulationResult = 0; //Draw
  }
  else{
  simulationResult =this.isTerminalState(this.tempBoard,this.tempBoardStatus,winner);
   /* 1 if Machine wins and -1 if human wins*/ }
  /* Current Node will be the terminal node*/
  this.MCTSUpdate(this.tempNode,simulationResult);
 }
 randomPlay(tempNode:Node):Node{
    //Making Availablle Empty Cells Array
    console.log("yeeee");
    console.log(tempNode);
    let childTempNode: Node;
    this.nextCell = this.calculateNextCell(tempNode.currentState.pos);
    console.log(this.nextCell);
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
    console.log("I'm Avaialble");
    console.log(this.available);
    let p = this.available[0];
    if(tempNode.player==0){
      this.tempBoard[this.nextCell[0]][this.nextCell[1]][p]==Cellenum.X;
      childTempNode = new Node(tempNode,1,new State(this.nextCell[0],this.nextCell[1],p),[]);
    }
    if(tempNode.player==1){
      this.tempBoard[this.nextCell[0]][this.nextCell[1]][p]==Cellenum.O;
      childTempNode = new Node(tempNode,0,new State(this.nextCell[0],this.nextCell[1],p),[]);
    }
    tempNode.children.push(childTempNode);
    while(this.available.length>0)
    {
      this.available.pop();
    }
    return tempNode;
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
 isTerminalState(board:Cellenum[][][],boardStatus:number[][],winner:number):number{
   if(this.isWinGame(boardStatus,winner)){
     return winner;
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


  getBestChildNode(rootNode:Node):any{
    this.iterator = 0;
    this.bestValue = 0;
    while(this.iterator!=rootNode.children.length)
    {
      if(this.bestValue>rootNode.children[this.iterator].nodeWinScore){
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

 isWinGame(boardStatus:number[][],winner:number){
  //Horizontal
  for(let row = 0 ; row < 3 ; row ++){
    if(boardStatus[row][0]==boardStatus[row][1] && boardStatus[row][1]==boardStatus[row][2] && (boardStatus[row][0]==1|| boardStatus[row][0]==-1)){
      winner = boardStatus[row][0];
      this.isGameOver = true;
      return true;
    }
  }

  //Vertical
  for(let col = 0 ; col < 3 ; col ++){
    if(boardStatus[0][col]==boardStatus[1][col] && boardStatus[2][col]==boardStatus[1][col] && boardStatus[0][col]==1){
      winner = boardStatus[0][col];
      this.isGameOver = true;
      return true;
    }
  }

  //Diagonal
  if(boardStatus[0][0]==boardStatus[1][1] && boardStatus[2][2]==boardStatus[1][1] && boardStatus[0][0]==1){
    winner = boardStatus[0][0]
    this.isGameOver = true;
    return true;
  }

  if(boardStatus[0][2]==boardStatus[1][1] && boardStatus[2][0]==boardStatus[1][1] && boardStatus[0][2]==1){
    winner = boardStatus[0][2]
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
  return !this.isWinGame(boardStatus,this.winner);
}



  
  
 
}
