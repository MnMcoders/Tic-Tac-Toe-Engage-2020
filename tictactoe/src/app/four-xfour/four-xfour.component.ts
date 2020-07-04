import { Component, OnInit, Input } from '@angular/core';
import { Playerenum } from '../cell/playerenum.enum';
import { Cellenum } from '../cell/cellenum.enum';

@Component({
  selector: 'app-four-xfour',
  templateUrl: './four-xfour.component.html',
  styleUrls: ['./four-xfour.component.css']
})
export class FourXfourComponent implements OnInit {

  @Input() public playerData;
  @Input() public gameData;
  
  public currentPlayer:Playerenum;
  private currentPlayerMove:Cellenum;
  private first: number[];
  public board : Cellenum[][];
  private isGameOver: boolean;
  public isFirstMove : boolean; 
  public statusMessage;
  public index:number;


  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  //Getter for isGameOver
  get gameOver():boolean {
    return this.isGameOver;
  }

  //Function to shuffle an array 
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

  //Start a new game
  newGame(){
    //Initialize the board 
    this.board = [];
    for(let row = 0;row < 4;row++){
      this.board[row] =[];
      for(let col = 0;col < 4;col++){
        this.board[row][col] = Cellenum.EMPTY;
      }
    }
    //Initialize first player if mentioned as else computer
    if(this.playerData === "machine") this.currentPlayer = Playerenum.c;
    if(this.playerData === "human") this.currentPlayer = Playerenum.h;
    //X always starts
    this.currentPlayerMove = Cellenum.X;
    this.isGameOver = false;
    if(this.currentPlayer===Playerenum.c)this.isFirstMove = true;
    if(this.currentPlayer===Playerenum.h)this.isFirstMove = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    if(this.currentPlayer===Playerenum.c)this.moveComputer();
  }

  //To render human's move
  move(row:number,col:number){
    if(!this.isGameOver && this.board[row][col]==Cellenum.EMPTY){
      this.board[row][col] = this.currentPlayerMove;
      if(this.isDraw()){
        this.statusMessage = 'It\'s a Draw!';
        this.isGameOver = true;
      }else if(this.isWin()){
        this.statusMessage = `Player ${this.currentPlayer} won!`;
        this.isGameOver = true;
      }else{
        this.currentPlayer = Playerenum.c;
        this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
        this.statusMessage =`Player ${this.currentPlayer}'s turn`;
      }
    }
    if(!this.isGameOver)this.moveComputer();
  }

  moveComputer(){
    //First Move of Computer
    if(this.isFirstMove==true)
    {
      this.first = [1,2,3,4,5,6,7,8];
      this.shuffle(this.first);

      switch(this.first[2]){
        case 1:
          this.board[0][0] = Cellenum.X;
          break;
        case 2:
          this.board[0][3] = Cellenum.X;
          break;
        case 3:
          this.board[1][1] = Cellenum.X;
          break;
        case 4:
          this.board[1][2] = Cellenum.X;
          break;
        case 5:
          this.board[2][1] = Cellenum.X;
          break;
        case 6:
          this.board[2][2] = Cellenum.X;
          break;
        case 7:
          this.board[3][0] = Cellenum.X;
          break;
        case 8:
          this.board[3][3] = Cellenum.X;
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
                //Undo the move 
                this.board[row][col] = Cellenum.EMPTY;
                if(currScore > bestScore){
                  bestScore = currScore;
                  bestMove = [row, col];
                }
            }
        }
      }
      this.board[bestMove[0]][bestMove[1]] = this.currentPlayerMove;
    }

    //Results of the move 
    if(this.isDraw()){
      this.statusMessage = 'It\'s a Draw';
      this.isGameOver = true;
    }
    else if(this.isWin()){
      this.statusMessage = `Player ${this.currentPlayer} won!`;
      this.isGameOver = true;
    }
    else{
      this.currentPlayer = Playerenum.h;
      this.currentPlayerMove = this.currentPlayerMove === Cellenum.X?Cellenum.O:Cellenum.X;
      this.statusMessage =`Player ${this.currentPlayer}'s turn`;
    }

  }

  public isWinner;
  /* Minimax with Alpa beta pruning - Maximizing player -> Computer */
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
      /* Maximizing Player -> always X */
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
      /*Minimizing Player -> always O*/
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

  /* Decision Functions */
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
    for(const rows of this.board){
      if(rows[0]===rows[1] && rows[1]===rows[2] && rows[2]===rows[3] && rows[0]!=Cellenum.EMPTY){
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
      return true;
    }
    if(
      this.board[0][3] === this.board[1][2] &&
      this.board[1][2] === this.board[2][1] &&
      this.board[2][1] === this.board[3][0] &&
      this.board[0][3]!= Cellenum.EMPTY
    ){
        return true;
    }
    return false;
  }

}
