import { Component, OnInit, Input } from '@angular/core';
import { Playerenum } from '../cell/playerenum.enum';
import { Cellenum } from '../cell/cellenum.enum';

@Component({
  selector: 'app-four-xfour',
  templateUrl: './four-xfour.component.html',
  styleUrls: ['./four-xfour.component.css']
})
export class FourXfourComponent implements OnInit {


  /* Declaring parent properties*/
  @Input() public playerData;
  @Input() public gameData;
  @Input() public opponentData;

  /* Declaring variables */
  public currentPlayer:Playerenum;
  private currentPlayerMove:Cellenum;
  private first: number[];
  public board : Cellenum[][];
  public isGameOver: boolean;
  public isFirstMove : boolean; 
  public statusMessage;
  public index:number;
  public selectedMoves;
  public isWinner:Cellenum;
  public isColorChanged;
  public hint:number[];
  public winningCells : number[][];
  public playerinStatus:string;


  

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  /*Getter for isGameOver*/ 
  get gameOver():boolean {
    return this.isGameOver;
  }

  /* Function to initialize a new game*/
  newGame(){
    this.hint = [];
    this.winningCells = [];
    this.selectedMoves = [];
    this.board = [];

    if(this.isColorChanged){
      for(let row =0; row < 4;row++){
        for(let col =0;col<4;col++){
          document.getElementById(row+"."+col).style.backgroundColor="";
        }
      }
      this.isColorChanged = false;
    }
    
    for(let row = 0;row < 4;row++){
      this.board[row] =[];
      for(let col = 0;col < 4;col++){
        this.board[row][col] = Cellenum.EMPTY;
      }
    }
    /* Remove remainder moves of previous game if any */
    while(this.selectedMoves.length)
    {
      this.selectedMoves.pop();
    }
    /*Initializing first player and move*/
    /*First move is Always X*/
    if(this.opponentData=="vsMachine" && this.playerData === "machine") this.currentPlayer = Playerenum.c;
    if(this.playerData === "human") this.currentPlayer = Playerenum.h;
    this.currentPlayerMove = Cellenum.X;
    this.isGameOver = false;
    if(this.currentPlayer===Playerenum.c)this.isFirstMove = true;
    if(this.currentPlayer===Playerenum.h)this.isFirstMove = false;

    /*Status Message*/
    this.playerinStatus = this.currentPlayer == Playerenum.c?"Agent":"Human";
    if(this.opponentData==="vsHuman") this.playerinStatus = "X";
    this.statusMessage = `${this.playerinStatus}'s turn`;

    if(this.currentPlayer===Playerenum.c)this.moveComputer();
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

  /* Function for human's move */
  move(row:number,col:number){
    if(this.isColorChanged){
      document.getElementById(this.hint[0]+"."+this.hint[1]).style.backgroundColor="";
      this.isColorChanged = false; 
      this.hint=[];
    }
    if(!this.isGameOver && this.board[row][col]==Cellenum.EMPTY){
      this.board[row][col] = this.currentPlayerMove;
      this.selectedMoves.push([row,col]);
      /* Terminal Conditions */
      if(this.isDraw()){
        this.statusMessage = 'It\'s a Draw!';
        this.isGameOver = true;
      }else if(this.isWin()){
        this.statusMessage = `${this.playerinStatus} Won!`;
        this.isGameOver = true;
        this.addColour(this.winningCells);
      }else{
        this.currentPlayer = Playerenum.c;
        if(this.opponentData === "vsHuman") this.playerinStatus = this.playerinStatus === Cellenum.X?"O":"X";
        else this.playerinStatus = "Agent";
        this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
        this.statusMessage =`${this.playerinStatus}'s turn`;
      }
    }
    if(!this.isGameOver && this.opponentData=="vsMachine")this.moveComputer();
  }

  /* Adds color to the necessary cells after a player wins */
  addColour(winningCells:number[][]){
    for(let i = 0 ; i < winningCells.length;i++){
      document.getElementById(winningCells[i][0]+"."+winningCells[i][1]).style.backgroundColor="green"; 
    }
    this.isColorChanged = true;
}


  /*Function for Computer's move */
  moveComputer(){
    /* Move if computer is starting player */
    if(this.isFirstMove==true)
    {
      this.first = [1,2,3,4,5,6,7,8];
      this.shuffle(this.first);

      switch(this.first[2]){
        case 1:
          this.board[0][0] = Cellenum.X;
          this.selectedMoves.push([0,0]);
          break;
        case 2:
          this.board[0][3] = Cellenum.X;
          this.selectedMoves.push([0,3]);
          break;
        case 3:
          this.board[1][1] = Cellenum.X;
          this.selectedMoves.push([1,1]);
          break;
        case 4:
          this.board[1][2] = Cellenum.X;
          this.selectedMoves.push([1,2]);
          break;
        case 5:
          this.board[2][1] = Cellenum.X;
          this.selectedMoves.push([2,1]);
          break;
        case 6:
          this.board[2][2] = Cellenum.X;
          this.selectedMoves.push([2,2]);
          break;
        case 7:
          this.board[3][0] = Cellenum.X;
          this.selectedMoves.push([3,0]);
          break;
        case 8:
          this.board[3][3] = Cellenum.X;
          this.selectedMoves.push([3,3]);
          break;
      }
      this.isFirstMove = false;
    }
    else{
      let bestScore = -Infinity;
      let bestMove = [-1,-1];
    
      for(let row =0;row < 4;row++){
        for(let col=0;col<4;col++){
            if(this.board[row][col]===Cellenum.EMPTY){
                this.board[row][col] = this.currentPlayerMove;
                let currScore;
                currScore = this.alphaBetaPruning(this.board,3,-Infinity,Infinity,false);
                this.board[row][col] = Cellenum.EMPTY;
                if(currScore > bestScore){
                  bestScore = currScore;
                  bestMove = [row, col];
                }
            }
        }
      }
      this.board[bestMove[0]][bestMove[1]] = this.currentPlayerMove;
      this.selectedMoves.push([bestMove[0],bestMove[1]]);
    }

    /* Terminal Conditions */
    if(this.isDraw()){
      this.statusMessage = 'It\'s a Draw';
      this.isGameOver = true;
    }
    else if(this.isWin()){
      this.addColour(this.winningCells);
      this.statusMessage = `${this.playerinStatus} Won!`;
      this.isGameOver = true;
    }
    else{
      this.currentPlayer = Playerenum.h;
      this.playerinStatus = "Human";
      this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
      this.statusMessage =`${this.playerinStatus}'s turn`;
    }

  }

  /* Function to undo a move */  
  undo(){
    let remove = 1;
    if(this.opponentData == "vsHuman") remove = 0;
    let undoLast = [];
    let undoSecondLast = [];
    if(this.selectedMoves.length> remove)
    {
      undoLast = this.selectedMoves.pop();
      this.board[undoLast[0]][undoLast[1]] = Cellenum.EMPTY;
      if(remove ==1){
        undoSecondLast = this.selectedMoves.pop();
        this.board[undoSecondLast[0]][undoSecondLast[1]] = Cellenum.EMPTY;
      }
      if(remove === 0) this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
    }
  }

  /* Function to provide Hints to the user */
  provideHints(){
    let bestNextMove:number[];
    let bestHumanScore:number= -Infinity;
    for(let row =0; row < 4;row++){
      for(let col =0;col< 4;col++){
        if(this.board[row][col] === Cellenum.EMPTY){
          this.board[row][col] = this.currentPlayerMove;
          let currHumanScore = this.alphaBetaPruning(this.board,3,-Infinity,Infinity,false);
          this.board[row][col] = Cellenum.EMPTY;
          if(currHumanScore > bestHumanScore){
            bestHumanScore = currHumanScore;
            bestNextMove = [row,col];
          }
        }  
      }
    }
    document.getElementById(bestNextMove[0]+"."+bestNextMove[1]).style.backgroundColor="yellow"; 
    this.isColorChanged = true;
    this.hint[0] = bestNextMove[0];
    this.hint[1] = bestNextMove[1];
  }

  
  /* Minimax with Alpa beta pruning */
  alphaBetaPruning(board:Cellenum[][],depth:number,alpha:number,beta:number,isMaximizing:boolean){
    if(depth==0)
      {
        if(isMaximizing)return 1;
        else return -1; 
      }
    if(this.isDraw())return 0;
      if(this.isWin())
      {
        this.winningCells = [];
        if(this.isWinner===this.currentPlayerMove)return 1;
        else return -1;
      }
      if(isMaximizing){
        let bestScore = -Infinity;
        for(let row=0;row<4;row++)
        {
          for(let col=0;col<4;col++)
          {
            if(board[row][col]===Cellenum.EMPTY)
            {
              board[row][col] = this.currentPlayerMove;
              let currScore = this.alphaBetaPruning(board,depth-1,alpha,beta,false);
              board[row][col] = Cellenum.EMPTY;
              bestScore = Math.max(currScore,bestScore);
              alpha = Math.max(alpha,bestScore);
              if(beta<=alpha)break;
            }
          }
        }
        return bestScore;
      }
      else
      {
        let bestScore = Infinity;
        for(let row=0;row< 4;row++)
        {
          for(let col=0;col< 4;col++)
          {
            if(board[row][col]===Cellenum.EMPTY)
            {
              board[row][col] = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
              let currScore = this.alphaBetaPruning(board,depth-1,alpha,beta,true);
              board[row][col] = Cellenum.EMPTY;
              bestScore = Math.min(currScore,bestScore);
              beta = Math.min(beta,bestScore);
              if(beta<=alpha)break;
            }
          }
        }
        return bestScore;
      }
  }

  /* TERMINAL FUNCTIONS */
  isDraw(): boolean {
    for(const columns of this.board){
      for(const cols of columns){
        if(cols==Cellenum.EMPTY) return false;
      }
    }
    return !this.isWin();
  }

  isWin():boolean{
    /*Horizontal*/ 
    for(let row = 0 ; row <4 ;row++){
      if(
        this.board[row][0] === this.board[row][1] &&
        this.board[row][1] === this.board[row][2] &&
        this.board[row][2] === this.board[row][3] &&
        this.board[row][0]!= Cellenum.EMPTY
      ){
        this.isWinner = this.board[row][0];
        this.winningCells[0] = [row,0];
        this.winningCells[1] = [row,1];
        this.winningCells[2] = [row,2];
        this.winningCells[3] = [row,3];
        return true;
      }
    } 
/*Vertical*/
for(let col = 0 ; col < 4 ;col++){
  if(
    this.board[0][col] === this.board[1][col] &&
    this.board[1][col] === this.board[2][col] &&
    this.board[2][col] === this.board[3][col] &&
    this.board[0][col]!= Cellenum.EMPTY
  ){
    this.isWinner = this.board[0][col];
    this.winningCells[0] = [0,col];
    this.winningCells[1] = [1,col];
    this.winningCells[2] = [2,col];
    this.winningCells[3] = [3,col];
    return true;
  }
}  

/*Diagonal*/ 
if(
  this.board[0][0] === this.board[1][1] &&
  this.board[1][1] === this.board[2][2] &&
  this.board[2][2] === this.board[3][3] &&
  this.board[0][0]!= Cellenum.EMPTY
){
  this.isWinner = this.board[0][0];
  this.winningCells[0] = [0,0];
  this.winningCells[1] = [1,1];
  this.winningCells[2] = [2,2];
  this.winningCells[3] = [3,3];    
  return true;
}
if(
  this.board[0][3] === this.board[1][2] &&
  this.board[1][2] === this.board[2][1] &&
  this.board[2][1] === this.board[3][0] &&
  this.board[0][3]!= Cellenum.EMPTY
){   
  this.isWinner = this.board[0][3];
  this.winningCells[0] = [0,3];
  this.winningCells[1] = [1,2];
  this.winningCells[2] = [2,1];
  this.winningCells[3] = [3,0];    
  return true;
}
//3 Cell Diagonal
if(
  this.board[0][2] === this.board[1][1] &&
  this.board[0][2] === this.board[2][0] &&
  this.board[0][2]!=Cellenum.EMPTY
){
  this.isWinner = this.board[0][2];
  this.winningCells[0] = [0,2];
  this.winningCells[1] = [1,1];
  this.winningCells[2] = [2,0];
  return true;
}
if(
  this.board[1][3] === this.board[2][2] &&
  this.board[2][2] === this.board[3][1] &&
  this.board[2][2]!=Cellenum.EMPTY
){
  this.isWinner = this.board[1][3];
  this.winningCells[0] = [1,3];
  this.winningCells[1] = [2,2];
  this.winningCells[2] = [3,1];
  return true;
}
if(
  this.board[0][1] === this.board[1][2] &&
  this.board[0][1] === this.board[2][3] &&
  this.board[0][1]!=Cellenum.EMPTY
){
  this.isWinner = this.board[0][1];
  this.winningCells[0] = [0,1];
  this.winningCells[1] = [1,2];
  this.winningCells[2] = [2,3];
  return true;
}
if(
  this.board[1][0] === this.board[2][1] &&
  this.board[2][1] === this.board[3][2] &&
  this.board[3][2]!=Cellenum.EMPTY
){
  this.isWinner = this.board[1][0];
  this.winningCells[0] = [1,0];
  this.winningCells[1] = [2,1];
  this.winningCells[2] = [3,2];
  
  return true;
}
return false;
}
}
