import { Component, OnInit, Input } from '@angular/core';
import { Cellenum } from '../cell/cellenum.enum';
import { Playerenum } from '../cell/playerenum.enum'

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

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

    newGame(){
      this.board=[];
      for(let row=0;row<3;row++)
      {
        this.board[row]=[];
        for(let col=0;col<3;col++)
        {
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
    //if(this.currentPlayer===Playerenum.c)this.moveComputer();
    }
 move(row:number, col:number, pos:number){
      console.log(row);
      console.log(col);
      console.log(pos);
      if(!this.isGameOver && this.board[row][col][pos]==Cellenum.EMPTY){
          this.board[row][col][pos] = this.currentPlayerMove;
          document.getElementById("0.0.0").innerHTML = this.currentPlayerMove;
          console.log(this.currentPlayerMove);
      }

 }

}
