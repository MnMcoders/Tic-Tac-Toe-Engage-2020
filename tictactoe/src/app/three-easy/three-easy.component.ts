import { Component, OnInit, Input } from '@angular/core';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'

@Component({
  selector: 'app-three-easy',
  templateUrl: './three-easy.component.html',
  styleUrls: ['./three-easy.component.css']
})

export class ThreeEasyComponent implements OnInit {

  @Input() public playerData;
  @Input() public gameData;
  @Input() public opponentData;
  
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

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  //Getter for isGameOver 
  get gameOver():boolean {
    return this.isThreeGameOver;
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

  //Start a new game 
  newGame(){
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
    while(this.selectedMoves.length)
    {
      this.selectedMoves.pop();
    }
    //First Player is Always X
    this.currentPlayerMove = Cellenum.X; 
    if(this.opponentData=="vsMachine" && this.playerData=="machine")this.currentPlayer = Playerenum.c;
    if(this.playerData=="human")this.currentPlayer = Playerenum.h;
    this.isThreeGameOver = false;
    if(this.currentPlayer===Playerenum.c)this.isFirstMove = true;
    if(this.currentPlayer===Playerenum.h)this.isFirstMove = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    if(this.currentPlayer===Playerenum.c)this.moveComputer();
  }

  //Make a move if the current is empty - for human
  move(row:number,col:number){
    if(!this.isThreeGameOver && this.board[row][col]==Cellenum.EMPTY){
      this.board[row][col] = this.currentPlayerMove;
      this.selectedMoves.push([row,col]);
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
  // Make a move if possible - for computer 
  moveComputer(){
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
        for(let i=0;i<3;i++)
        {
          for(let j=0;j<3;j++)
          {
            if(this.board[i][j]===Cellenum.EMPTY)
            {
              this.board[i][j] = this.currentPlayerMove;
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
              this.board[i][j] = Cellenum.EMPTY;
              if(currScore>bestScore){
                bestScore = currScore;
                bestMove = [i, j];
                //console.log(bestScore);
              }
            }
          }
        }
        this.board[bestMove[0]][bestMove[1]] = this.currentPlayerMove;
        this.selectedMoves.push([bestMove[0],bestMove[1]]);
      }
    }

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

    
  undo(){
    let undoLast = [];
    let undoSecondLast = [];
    if(this.selectedMoves.length>1)
    {
      undoLast = this.selectedMoves.pop();
      this.board[undoLast[0]][undoLast[1]] = Cellenum.EMPTY;
      undoSecondLast = this.selectedMoves.pop();
      this.board[undoSecondLast[0]][undoSecondLast[1]] = Cellenum.EMPTY;
      if(this.gameData=="Easy")this.index--;
    }
  }

  public isWinner;
  minimax(board:Cellenum[][],depth:number,isMaximizing:boolean){  
      if(depth==0)
      {
        if(isMaximizing)return 1;
        else return -1; 
      }
      if(this.isDraw())return 0;
      if(this.isWin())
      {
        //console.log(this.isWinner);
        if(this.isWinner===this.currentPlayerMove)return 1;
        else return -1;
      }

      if(isMaximizing){
        let bestScore = -Infinity;
        for(let i=0;i<3;i++)
        {
          for(let j=0;j<3;j++)
          {
            if(board[i][j]===Cellenum.EMPTY)
            {
              board[i][j] = this.currentPlayerMove;
              let currScore = this.minimax(board,depth-1,false);
              board[i][j] = Cellenum.EMPTY;
              bestScore = Math.max(currScore,bestScore);
            }
          }
        }
        return bestScore;
      }
      else
      {
        let bestScore = Infinity;
        for(let i=0;i<3;i++)
        {
          for(let j=0;j<3;j++)
          {
            if(board[i][j]===Cellenum.EMPTY)
            {
              if(this.currentPlayerMove===Cellenum.X)
              board[i][j] = Cellenum.O;
              else board[i][j] = Cellenum.X;
              let currScore = this.minimax(board,depth-1,true);
              board[i][j] = Cellenum.EMPTY;
              bestScore = Math.min(currScore,bestScore);
            }
          }
        }
        return bestScore;
      }
  }

  alphaBetaPruning(board:Cellenum[][],depth:number,alpha:number,beta:number,isMaximizing:boolean){
    if(depth==0)
      {
        if(isMaximizing)return 1;
        else return -1; 
      } 
    if(this.isDraw())return 0;
      if(this.isWin())
      {
        //console.log(this.isWinner);
        if(this.isWinner===this.currentPlayerMove)return 1;
        else return -1;
      }

      if(isMaximizing){
        let bestScore = -Infinity;
        for(let i=0;i<3;i++)
        {
          for(let j=0;j<3;j++)
          {
            if(board[i][j]===Cellenum.EMPTY)
            {
              board[i][j] = this.currentPlayerMove;
              let currScore = this.alphaBetaPruning(board,depth-1,alpha,beta,false);
              board[i][j] = Cellenum.EMPTY;
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
        for(let i=0;i<3;i++)
        {
          for(let j=0;j<3;j++)
          {
            if(board[i][j]===Cellenum.EMPTY)
            {
              if(this.currentPlayerMove===Cellenum.X)
              board[i][j] = Cellenum.O;
              else board[i][j] = Cellenum.X;
              let currScore = this.alphaBetaPruning(board,depth-1,alpha,beta,true);
              board[i][j] = Cellenum.EMPTY;
              bestScore = Math.min(currScore,bestScore);
              beta = Math.min(beta,bestScore);
              if(beta<=alpha)break;
            }
          }
        }
        return bestScore;
      }
  }

  //Is the game a 
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
      return true;
    }
    if(
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0] &&
      this.board[0][2]!= Cellenum.EMPTY
    ){
        this.isWinner = this.board[0][2];
        return true;
    }
    return false;
  }
}

