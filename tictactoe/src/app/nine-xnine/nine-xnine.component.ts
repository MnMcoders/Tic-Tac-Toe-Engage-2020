import { Component, OnInit, Input} from '@angular/core';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'
import { Board, Node, State } from './node';



@Component({
  selector: 'app-nine-xnine',
  templateUrl: './nine-xnine.component.html',
  styleUrls: ['./nine-xnine.component.css']
})
export class NineXnineComponent implements OnInit {
  
  /* Declaring parent properties*/
  @Input() public playerData;
  @Input() public gameData;

  /* Declaring variables */
  public currentPlayer:Playerenum;
  public currentPlayerMove:Cellenum;
  public mainboard : Cellenum[][][];
  public isGameOver: boolean;
  public statusMessage;
  public mainboardStatus:number[][]; /* 0 -> Empty ; 1 -> Machine won ; -1 -> Human won ; 2 -> Draw */
  public nextCell=[];
  public bestMove=[];
  public isFirstMove = true;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(){
    this.mainboard=[];
    this.mainboardStatus=[];
    for(let row=0;row<3;row++)
    {
      this.mainboard[row]=[];
      this.mainboardStatus[row] = [];
      for(let col=0;col<3;col++)
      {
        this.mainboardStatus[row][col] = 0;
        this.mainboard[row][col]=[];
        for(let pos=0;pos<9;pos++)
        {
          this.mainboard[row][col][pos] = Cellenum.EMPTY;
        }
      }
    }
    this.currentPlayerMove = Cellenum.X;
    this.currentPlayer = Playerenum.h;
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
  }

  /* Function to shuffle an array */
  shuffle(array: number[]){
    let currentIndex = array.length, temporaryValue :number , randomIndex : number;
    while(currentIndex!=0){
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  /* Function for Human's move */
  move(row:number, col:number, pos:number){
    if(this.mainboardStatus[row][col]!=0){
        alert("Select any other board!");
        return;
    }
    else if(!this.isFirstMove && (row != this.nextCell[0] || col!= this.nextCell[1])){
      if(this.nextCell[0]!=-1 && this.nextCell[1]!=-1){
        alert("Invalid Move");
        return;
      }
    }
    if(!this.isGameOver && this.mainboard[row][col][pos]==Cellenum.EMPTY){
        this.isFirstMove = false;
        this.mainboard[row][col][pos] = this.currentPlayerMove;
        document.getElementById((row+"."+col+"."+pos)).innerHTML = this.currentPlayerMove;
    }
  
    if(this.isDrawBoard(row,col,this.mainboard,this.mainboardStatus,this.currentPlayer)|| this.isWinBoard(row,col,this.mainboard,this.mainboardStatus,this.currentPlayer)){
      if(this.isDrawGame(this.mainboardStatus)){
        this.statusMessage = 'It\'s a Draw!';
        this.isGameOver = true;
      }else if(this.isWinGame(this.mainboardStatus)){
        this.statusMessage = `Player ${this.currentPlayer} won!`;
        this.isGameOver = true;
      }
    }
    
    this.currentPlayer = Playerenum.c;
    this.currentPlayerMove = Cellenum.O;
    this.statusMessage =`Player ${this.currentPlayer}'s turn`;
    
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
  /* To select a small board if the board directed to is in terminal state */
  selectRandomBoard(boardStatus:number[][]):number[]{
    let row = (Math.floor((Math.random() * 3) + 1))-1;
    let col = (Math.floor((Math.random() * 3) + 1))-1;
    while(boardStatus[row][col]!=0){
      row = (Math.floor((Math.random() * 3) + 1))-1;
      col = (Math.floor((Math.random() * 3) + 1))-1;
    }
    return [row,col];
  }

  /* Computer's move  - implements MONTE CARLO SEARCH TREE*/
  moveComputer(row:number,col:number,pos:number){ 
    if(this.mainboardStatus[row][col]!=0){
        this.nextCell = this.calculateNextCell(pos);
        row = this.nextCell[0];
        col = this.nextCell[1];
        if(this.mainboardStatus[row][col]!=0)  
        {
          let next = this.selectRandomBoard(this.mainboardStatus);
          row = next[0];
          col = next[1];
        }
    }
    let mainboardCopy = JSON.parse(JSON.stringify(this.mainboard));
    let mainboardStatusCopy = JSON.parse(JSON.stringify(this.mainboardStatus));
    let bestMove = this.MCTS(mainboardCopy,mainboardStatusCopy,row,col,pos,Cellenum.O);

    /* Make the best move */
    this.mainboard[bestMove[0]][bestMove[1]][bestMove[2]] = this.currentPlayerMove;
    document.getElementById((bestMove[0]+"."+bestMove[1]+"."+bestMove[2])).innerHTML = this.currentPlayerMove;

    this.nextCell = this.calculateNextCell(bestMove[2]);
    if(this.mainboardStatus[this.nextCell[0]][this.nextCell[1]]!=0){
      this.nextCell = [-1,-1]
    }

    if(this.isDrawBoard(row,col,this.mainboard,this.mainboardStatus,this.currentPlayer)|| this.isWinBoard(row,col,this.mainboard,this.mainboardStatus,this.currentPlayer)){
      if(this.isDrawGame(this.mainboardStatus)){
        this.statusMessage = 'It\'s a Draw!';
        this.isGameOver = true;
      }else if(this.isWinGame(this.mainboardStatus)){
        this.statusMessage = `Player ${this.currentPlayer} won!`;
        this.isGameOver = true;
      }
    }
    
    this.currentPlayer = Playerenum.h;
    this.currentPlayerMove = Cellenum.X;
    this.statusMessage =`Player ${this.currentPlayer}'s turn`;
    
  }

  MCTS(board:Cellenum[][][],boardStatus: number[][],row:number,col:number,pos:number,playerMove:Cellenum):number[]{
    /*Form the root -> Start With Computer*/ 
    let initialState = new State([row,col,pos],new Board(board,boardStatus),1,playerMove,false);  
    let rootNode = new Node(initialState,null,[]); 
    //Get child nodes:
    this.expansion(rootNode);
    rootNode.isVisited=true;
    let noOfIterations = 2;
    let iterations = 0;
    while(iterations < noOfIterations){
      //Select a Node : UTF VALUE
      let nodeToSimulate = this.selection(rootNode);
      if(nodeToSimulate.isVisited===true){
         this.expansion(nodeToSimulate);
         
      }
      else{
         this.simulation(nodeToSimulate);
      }
      iterations++;
    }

    //Select Best Move from children
    let bestWinScore= -Infinity;
    let bestNextNode:Node;
    for(let j = 0; j < rootNode.children.length;j++){
      let currWinScore = rootNode.children[j].state.winScore;
      if(currWinScore >=bestWinScore){
        bestWinScore = currWinScore;
        bestNextNode = rootNode.children[j];
      }
    }
    return (bestNextNode.state.move);
  }

  //Monte Carlo Helper Functions:
  isLeafNode(node:Node){
    if(node.children.length === 0) return true;
    return false;
  }

  calculateUTF(node:Node):number{
    if(node.getState().visitCount ===0)return 2147483647;
    let val  = Math.fround(node.getState().winScore/node.getState().visitCount) + Math.fround((1.41*(Math.sqrt(Math.log(node.parent.getState().visitCount))))/(node.getState().visitCount))
    return val;
  }

  selection(node:Node){
    let bestUTF = -Infinity;
    let bestNextNode:Node;
    for(let i =0; i < node.children.length;i++){                  
      let currUTF = this.calculateUTF(node.children[i]);
      if(currUTF > bestUTF){
        bestUTF = currUTF;
        bestNextNode = node.children[i];
      }
    }
    if(this.isLeafNode(bestNextNode)===true) return bestNextNode;
    else return this.selection(bestNextNode);
  }


  expansion(leafNode:Node){
    let children = this.getAllPossibleStates(leafNode);
    //Expand Child Nodes:
    for(let i = 0; i < children.length;i++){
      let childNode = new Node(children[i],leafNode,[]);
      leafNode.children.push(childNode);
    }
  }

  simulation(leafNode:Node){
    leafNode.isVisited = true;
    let boardStatus = JSON.parse(JSON.stringify(leafNode.state.board.boardStatus));
    let board = JSON.parse(JSON.stringify(leafNode.state.board.board));
    let player = leafNode.state.playerNo;
    let playerName = player ===-1?Playerenum.h:Playerenum.c;
    let playerMove = leafNode.state.playerMove;
    let pos = leafNode.state.move[2];
    let playerWon;
    while(!this.isWinGame(boardStatus) && !this.isDrawGame(boardStatus)){
      let randomMove = this.getRandomPlay(board,boardStatus,pos);
      //Board chosen is full
      if(randomMove[0]==-1)break;
      pos = randomMove[2];
      board[randomMove[0]][randomMove[1]][randomMove[2]] = playerMove;
      if(this.isWinBoard(randomMove[0],randomMove[1],board,boardStatus,playerName)) {
        boardStatus[randomMove[0]][randomMove[1]] = player;
        playerWon = player;
      }
      else if(this.isDrawBoard(randomMove[0],randomMove[1],board,boardStatus,playerName)){
        boardStatus[randomMove[0]][randomMove[1]] =  2;
        playerWon = 0
      }
      player = player===1?-1:1;
      playerMove = playerMove ===Cellenum.O?Cellenum.X:Cellenum.O;
    
      playerName = playerName === Playerenum.c?Playerenum.h:Playerenum.c;
      
    }
    this.update(leafNode,playerWon);
  }


  getRandomPlay(board:Cellenum[][][],boardStatus:number[][],previousPos : number):number[]{
    let nextMoves = this.calculateNextCell(previousPos);
    let row = nextMoves[0];
    let col = nextMoves[1];
    //Board is full
    if(boardStatus[row][col]!=0){
        let next = this.selectRandomBoard(boardStatus);
        row = next[0];
        col = next[1];
    }
    //Select one of these random states
   let pos = 0;
    for(let i = 0 ; i < 9 ; i++){
      if(board[row][col][i]==Cellenum.EMPTY){
        pos = i;
        break;
      }
    }

    /*let posArray = [];
    for(let i=0;i<9;i++)
    {
      if(board[row][col][i]==Cellenum.EMPTY)
      {
        posArray.push(i);
      }
    }
    this.shuffle(posArray);
    let pos = posArray[0];*/
    return [row,col,pos];
  }

  update(terminalNode:Node,playerWon:number){
    while(terminalNode!=null){
      terminalNode.getState().visitCount++;
      terminalNode.getState().playerNo == playerWon
      if(playerWon==1|| playerWon ==0)terminalNode.getState().winScore++;
      else if(playerWon==-1)terminalNode.getState().winScore--;
      terminalNode = terminalNode.parent;
    }
  }

  /* Get Next State from current Node State */
  getAllPossibleStates(currentNode:Node):Array<State>{
    let nextPossibleStates:State[]=[];
    let nextState = this.calculateNextCell(currentNode.state.move[2]);
    let row = nextState[0];
    let col = nextState[1];
    //If the next Board is not empty, picking random next Board
    if(currentNode.state.board.boardStatus[nextState[0]][nextState[1]]!=0){
      let next = this.selectRandomBoard(currentNode.state.board.boardStatus);
      row = next[0];
      col = next[1];
    }
    let nextPlayer = currentNode.state.playerNo===1?-1:1;
    let nextPlayerMove = currentNode.state.playerMove===Cellenum.X?Cellenum.O:Cellenum.X;
    let player = nextPlayer===-1?Playerenum.h:Playerenum.c;
    for(let i = 0 ; i < 9 ; i++){
        const resetBoard = JSON.parse(JSON.stringify(currentNode.state.board));
        if(currentNode.state.board.board[row][col][i]===Cellenum.EMPTY){
            let nextBoard = new Board(currentNode.state.board.board,currentNode.state.board.boardStatus);
            nextBoard.board[row][col][i] = currentNode.state.playerMove;
            currentNode.state.board = resetBoard;
            /*Update Board Status if its terminal after this move*/
            if(this.isWinBoard(row,col,nextBoard.board,nextBoard.boardStatus,player)) {
              nextBoard.boardStatus[row][col] = currentNode.state.playerNo;
            }
            else if(this.isDrawBoard(row,col,nextBoard.board,nextBoard.boardStatus,player)){
              nextBoard.boardStatus[row][col] = 2;
            } 
            
            let isTerminal = false;
            if(this.isWinGame(nextBoard.boardStatus)|| this.isDrawGame(nextBoard.boardStatus)){
              isTerminal = true;
            }  
            let state = new State([row,col,i],nextBoard,nextPlayer,nextPlayerMove,false);
            nextPossibleStates.push(state);
        }
    }
    return nextPossibleStates;
  }

  

 



  


/* TERMINAL FUNCTIONS */
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
        return true;
      }
    }
  
    //Vertical
    for(let col = 0 ; col < 3 ; col ++){
      if(boardStatus[0][col]==boardStatus[1][col] && boardStatus[2][col]==boardStatus[1][col] && (boardStatus[0][col]==1|| boardStatus[0][col]==-1)){
        return true;
      }
    }
  
    //Diagonal
    if(boardStatus[0][0]==boardStatus[1][1] && boardStatus[2][2]==boardStatus[1][1] && ((boardStatus[0][0]==1|| boardStatus[0][0]==-1))){
      return true;
    }
  
    if(boardStatus[0][2]==boardStatus[1][1] && boardStatus[2][0]==boardStatus[1][1] && (boardStatus[1][1]==1|| boardStatus[1][1]==-1)){
      return true;
    }
  
    return false;
  }
  
  
  isDrawBoard(row:number,col:number,board:Cellenum[][][],boardStatus:number[][],currentPlayer:Playerenum): boolean {
    for(let pos = 0; pos < 9 ; pos++){
      if(board[row][col][pos]== Cellenum.EMPTY) return false;
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