import { Component, OnInit, Input } from '@angular/core';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'
import { NgStyle } from '@angular/common';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-three-easy',
  templateUrl: './three-easy.component.html',
  styleUrls: ['./three-easy.component.css']
})

export class ThreeEasyComponent implements OnInit {

  /* Declaring parent properties*/
  @Input() public playerData; 
  @Input() public gameData;  
  @Input() public opponentData; 
  
  /* Declaring variables */
  public currentPlayer:Playerenum;
  private currentPlayerMove:Cellenum;
  private moves: number[];
  private first: number[];
  public board : Cellenum[][];
  public isThreeGameOver: boolean;
  public isFirstMove : boolean; 
  public statusMessage;
  public index:number;
  public selectedMoves = [];
  public isWinner:Cellenum;
  public isColorChanged;
  public hint:number[] = [];

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  /*Getter for isGameOver*/ 
  get gameOver():boolean {
    return this.isThreeGameOver;
  }


  /* Function to initialize a new game*/
  newGame(){
    if(this.isColorChanged){
      for(let row =0; row < 3;row++){
        for(let col =0;col<3;col++){
          document.getElementById(row+"."+col).style.backgroundColor="";
        }
      }
    }
    if(this.gameData=="Easy")
    {
      this.index = 0;
      this.moves = [1,4,3,2,5,7,6,8,0];
      this.shuffle(this.moves);
    }
      this.board=[];
    for(let row = 0;row<3;row++){
      this.board[row] =[];
      for(let col =0;col <3;col++){
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
    this.currentPlayerMove = Cellenum.X; 
    if(this.opponentData=="vsMachine" && this.playerData=="machine")this.currentPlayer = Playerenum.c;
    if(this.playerData=="human")this.currentPlayer = Playerenum.h;
    this.isThreeGameOver = false;
    if(this.currentPlayer===Playerenum.c)this.isFirstMove = true;
    if(this.currentPlayer===Playerenum.h)this.isFirstMove = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
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
    }
    if(!this.isThreeGameOver && this.board[row][col]==Cellenum.EMPTY){
      this.board[row][col] = this.currentPlayerMove;
      this.selectedMoves.push([row,col]);
      /* Terminal Conditions */
      if(this.isDraw()){
        this.statusMessage = 'It\'s a Draw!';
        this.isThreeGameOver = true;
      }else if(this.isWin()){
        this.statusMessage = `Player ${this.currentPlayer} won!`; 
        this.isThreeGameOver = true;
      }else{
        this.currentPlayer = Playerenum.c;
        this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
        this.statusMessage =`Player ${this.currentPlayer}'s turn`;
      }
    }
    if(!this.isThreeGameOver && this.opponentData=="vsMachine")this.moveComputer();
  }

  /*Function for Computer's move */
  moveComputer(){

    /* Random selection of next move for level easy */
    if(this.gameData=="Easy")
    {
      let r;
      let c;
      if(!this.isThreeGameOver){
        while(this.index < this.moves.length){
          r = Math.floor(this.moves[this.index]/3);
          c = this.moves[this.index]%3;
          if(this.board[r][c] === Cellenum.EMPTY){
            this.board[r][c] = this.currentPlayerMove;
            this.selectedMoves.push([r,c]);
            this.index++;
            break;
          }
          this.index++;
        }
      }
    }
    else
    { 
      /* Move if computer is starting player */
      if(this.isFirstMove==true)
      {
        this.first = [0, 2, 4, 6, 8];
        this.shuffle(this.first);
        switch(this.first[2])
        {
          case 0:
            this.board[0][0] = Cellenum.X;
            this.selectedMoves.push([0,0]);
            break;
          case 2:
            this.board[0][2] = Cellenum.X;
            this.selectedMoves.push([0,0]);
            break;
          case 4:
            this.board[1][1] = Cellenum.X;
            this.selectedMoves.push([0,0]);
            break;
          case 6:
            this.board[2][0] = Cellenum.X;
            this.selectedMoves.push([0,0]);
            break;
          case 8:
            this.board[2][2] = Cellenum.X;
            this.selectedMoves.push([0,0]);
            break;
        }
        this.isFirstMove = false;
      }
      else{
        let bestScore = -Infinity;
        let bestMove = [-1,-1];
        for(let row=0;row<3;row++)
        {
          for(let col=0;col<3;col++)
          {
            if(this.board[row][col]===Cellenum.EMPTY)
            {
              this.board[row][col] = this.currentPlayerMove;
              let currScore;
              switch(this.gameData)
              {
                case "Medium":
                  currScore = this.minimax(this.board,3,false);
                  break;
                case "Hard":
                  currScore = this.minimax(this.board,7,false);
                  break;
                case "Pro":
                  currScore = this.alphaBetaPruning(this.board,11,-Infinity,Infinity,false);
                  break;
                }
              this.board[row][col] = Cellenum.EMPTY;
              if(currScore>bestScore){
                bestScore = currScore;
                bestMove = [row, col];
              }
            }
          }
        }
        this.board[bestMove[0]][bestMove[1]] = this.currentPlayerMove;
        this.selectedMoves.push([bestMove[0],bestMove[1]]);
      }
    }
    /* Terminal Conditions */
    if(this.isDraw()){
      this.statusMessage = 'It\'s a Draw!';
      this.isThreeGameOver = true;
    }else if(this.isWin()){
      this.statusMessage = `Player ${this.currentPlayer} won!`;
      this.isThreeGameOver = true;
    }else{
      this.currentPlayer = Playerenum.h;
      this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
      this.statusMessage =`Player ${this.currentPlayer}'s turn`;
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
      if(this.gameData=="Easy")this.index--;
      if(remove === 0) this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
    }
  }


  /* Function implementing Minimax Algorithm */
  minimax(board:Cellenum[][],depth:number,isMaximizing:boolean){  
      if(depth==0)
      {
        if(isMaximizing)return 1;
        else return -1; 
      }
      if(this.isDraw())return 0;
      if(this.isWin())
      {
        if(this.isWinner===this.currentPlayerMove)return 1;
        else return -1;
      }
      if(isMaximizing){
        let bestScore = -Infinity;
        for(let row=0;row<3;row++)
        {
          for(let col=0;col<3;col++)
          {
            if(board[row][col]===Cellenum.EMPTY)
            {
              board[row][col] = this.currentPlayerMove;
              let currScore = this.minimax(board,depth-1,false);
              board[row][col] = Cellenum.EMPTY;
              bestScore = Math.max(currScore,bestScore);
            }
          }
        }
        return bestScore;
      }
      else
      {
        let bestScore = Infinity;
        for(let row=0;row<3;row++)
        {
          for(let col=0;col<3;col++)
          {
            if(board[row][col]===Cellenum.EMPTY)
            {
              if(this.currentPlayerMove===Cellenum.X)
              board[row][col] = Cellenum.O;
              else board[row][col] = Cellenum.X;
              let currScore = this.minimax(board,depth-1,true);
              board[row][col] = Cellenum.EMPTY;
              bestScore = Math.min(currScore,bestScore);
            }
          }
        }
        return bestScore;
      }
  }


  /* Minimax with Alpha beta pruning */
  alphaBetaPruning(board:Cellenum[][],depth:number,alpha:number,beta:number,isMaximizing:boolean){
    if(depth==0)
      {
        if(isMaximizing)return 1;
        else return -1; 
      } 
    if(this.isDraw())return 0;
      if(this.isWin())
      {
        if(this.isWinner===this.currentPlayerMove)return 1;
        else return -1;
      }

      if(isMaximizing){
        let bestScore = -Infinity;
        for(let row=0;row<3;row++)
        {
          for(let col=0;col<3;col++)
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
        for(let row=0;row<3;row++)
        {
          for(let col=0;col<3;col++)
          {
            if(board[row][col]===Cellenum.EMPTY)
            {
              if(this.currentPlayerMove===Cellenum.X)
              board[row][col] = Cellenum.O;
              else board[row][col] = Cellenum.X;
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

  
   /* Function to provide Hints to the user */
   provideHints(){
       let bestNextMove:number[];
       let bestHumanScore:number= -Infinity;
       for(let row =0; row < 3;row++){
         for(let col =0;col<3;col++){
           if(this.board[row][col] === Cellenum.EMPTY){
             this.board[row][col] = this.currentPlayerMove;
             let currHumanScore = this.minimax(this.board,7,false);
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

  /*TERMINAL FUNCTIONS */

  isDraw(): boolean {
    for(const columns of this.board){
      for(const cols of columns){
        if(cols==Cellenum.EMPTY) return false;
      }
    }
    return !this.isWin();
  }


  isWin():boolean{
    //Horizontal 
    for(let row = 0 ; row <3 ;row++){
      if(
        this.board[row][0] === this.board[row][1] &&
        this.board[row][1] === this.board[row][2] &&
        this.board[row][0]!= Cellenum.EMPTY
      ){
        this.isWinner = this.board[row][0];
        document.getElementById(row+"."+0).style.backgroundColor="green";
        document.getElementById(row+"."+1).style.backgroundColor="green";
        document.getElementById(row+"."+2).style.backgroundColor="green";
        this.isColorChanged=true;
        return true;
      }
    } 

    //Vertical 
    for(let col = 0 ; col <3 ;col++){
      if(
        this.board[0][col] === this.board[1][col] &&
        this.board[1][col] === this.board[2][col] &&
        this.board[0][col]!= Cellenum.EMPTY
      ){
        this.isWinner = this.board[1][col];
        document.getElementById(0+"."+col).style.backgroundColor="green";
        document.getElementById(1+"."+col).style.backgroundColor="green";
        document.getElementById(2+"."+col).style.backgroundColor="green";
        this.isColorChanged=true;
        return true;
      }
    }  

    //diagonals 
    if(
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2] &&
      this.board[0][0]!= Cellenum.EMPTY
    ){
      this.isWinner = this.board[0][0];
      document.getElementById(0+"."+0).style.backgroundColor="green";
      document.getElementById(1+"."+1).style.backgroundColor="green";
      document.getElementById(2+"."+2).style.backgroundColor="green";
      this.isColorChanged=true;
      return true;
    }
    if(
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0] &&
      this.board[0][2]!= Cellenum.EMPTY
    ){
         this.isWinner = this.board[0][2];
        document.getElementById(0+"."+2).style.backgroundColor="green";
        document.getElementById(1+"."+1).style.backgroundColor="green";
        document.getElementById(2+"."+0).style.backgroundColor="green";
        this.isColorChanged=true;
        return true;
    }
    return false;
  }

}

