import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { element } from 'protractor';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit{

  
  @Output() gameEvent = new EventEmitter<string>();
  @Output() playerEvent = new EventEmitter<string>();
  @Output() opponentEvent = new EventEmitter<string>();
  @Output() displayEvent = new EventEmitter<boolean>();

  /* Declaration of variables */
  public gameSelection = false;
  public playerSelection = false;
  public opponentSelection = false;
  public gameName = ['Easy','Medium', 'Hard', 'Pro','four','nine'];
  public playerName = ['human','machine'];
  public opponentName = ['vsMachine','vsHuman'];
  

  constructor() { }

  ngOnInit(): void {
    this.displayEvent.emit(false);
  }

  onClickGameType(gameType: string){
    for(let i=0;i<6;i++)
    {
      document.getElementById(this.gameName[i]).style.backgroundColor = "";
    }
    document.getElementById(gameType).style.backgroundColor = "Brown";
    console.log(this.gameName);
    this.gameSelection = true;
    this.gameEvent.emit(gameType);
    this.displayEvent.emit(false);
  }

  onClickPlayerType(playerType: string){
    for(let i=0;i<2;i++)
    {
      document.getElementById(this.playerName[i]).style.backgroundColor = "";
    }
    document.getElementById(playerType).style.backgroundColor = "Brown";
    this.playerSelection = true;
    this.playerEvent.emit(playerType);
    this.displayEvent.emit(false);
  }

  onClickAgainst(against:string){
    for(let i=0;i<2;i++)
    {
      document.getElementById(this.opponentName[i]).style.backgroundColor = "";
    }
    document.getElementById(against).style.backgroundColor = "Brown";
    this.opponentSelection = true;
    this.opponentEvent.emit(against);
    this.displayEvent.emit(false);
  }
  
  onClickToPlay(){
    if(this.gameSelection==true && this.playerSelection==true && this.opponentSelection==true){
       this.displayEvent.emit(true);
    }
    else if(this.gameSelection==true && this.playerSelection==false){
      alert("Please Select the Starting Player!");
       this.displayEvent.emit(false);
    }
    else if(this.gameSelection==false && this.playerSelection==true){
      alert("Please Select the Game Type!");
       this.displayEvent.emit(false);
    }
    else{
      alert("Please Select the Starting Player and the Game Type!");
      this.displayEvent.emit(false);
    }
  }
}
