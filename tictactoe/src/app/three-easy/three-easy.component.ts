import { Component, OnInit } from '@angular/core';
import { Element } from '@angular/compiler';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'

@Component({
  selector: 'app-three-easy',
  templateUrl: './three-easy.component.html',
  styleUrls: ['./three-easy.component.css']
})
export class ThreeEasyComponent implements OnInit {

  public currentPlayer:Playerenum;
  private currentPlayerMove:Cellenum;
  private moves: number[];
  public board : Cellenum[][];
  private isGameOver: boolean;
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

  shuffle(array: number[]){
    let currentIndex = array.length, temporaryValue :number , randomIndex : number;
    while(currentIndex!=0){
      //Pick remaining element 
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
    this.index = 0;
    this.moves = [1,4,3,2,5,7,6,8,0];
    this.shuffle(this.moves);
    this.board=[];
    for(let row = 0;row<3;row++){
      this.board[row] =[];
      for(let col =0;col <3;col++){
        this.board[row][col] = Cellenum.EMPTY;
      }
    }
    //First Player is computer and is X
    this.currentPlayerMove = Cellenum.X;
    this.currentPlayer = Playerenum.c;
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    this.moveComputer();
  }

  //Make a move if the current is empty - for human
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
        this.currentPlayerMove = Cellenum.X;
      }
    }
    this.moveComputer();
  }
  // Make a move if possible - for computer 
  moveComputer(){
    let r;
    let c;
    if(!this.isGameOver){
      while(this.index < this.moves.length){
        r = Math.floor(this.moves[this.index]/3);
        c = this.moves[this.index]%3;
        if(this.board[r][c] === Cellenum.EMPTY){
          this.board[r][c] = this.currentPlayerMove;
          this.index++;
          break;
        }
        this.index++;
      }
    }
    if(this.isDraw()){
      this.statusMessage = 'It\'s a Draw!';
      this.isGameOver = true;
    }else if(this.isWin()){
      this.statusMessage = `Player ${this.currentPlayer} won!`;
      this.isGameOver = true;
    }else{
      this.currentPlayer = Playerenum.h;
      this.currentPlayerMove = Cellenum.O;
    }
  }

  //Is the game a Draw
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
    for(const columns of this.board){
      if(columns[0]===columns[1] && columns[1]===columns[2] && columns[0]!=Cellenum.EMPTY){
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
        return true;
      }
    }  

    //diagonals 
    if(
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2] &&
      this.board[0][0]!= Cellenum.EMPTY
    ){
      return true;
    }
    if(
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0] &&
      this.board[0][2]!= Cellenum.EMPTY
    ){
        return true;
    }
    return false;
  }
}
