import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { logWarnings } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {

  @Output() gameEvent = new EventEmitter<string>();
  @Output() playerEvent = new EventEmitter<string>();
  @Output() opponentEvent = new EventEmitter<string>();
  @Output() displayEvent = new EventEmitter<boolean>();


  public gameSelection = false;
  public playerSelection = false;
  public opponentSelection = false;

  constructor() { }
  ngOnInit(): void {
  }

  onClickGameType(gameType: string){
    this.gameSelection = true;
    this.gameEvent.emit(gameType);
    this.displayEvent.emit(false);
  }
  onClickPlayerType(playerType: string){
    this.playerSelection = true;
    this.playerEvent.emit(playerType);
    this.displayEvent.emit(false);
  }
  onClickAgainst(against:string){
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
