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
  @Output() displayEvent = new EventEmitter<boolean>();

  public gameSelection = false;
  public playerSelection = false;

  constructor() { }

  ngOnInit(): void {
  }

  onClickEasy(){
    this.gameSelection = true;
    this.gameEvent.emit("easy");
    this.displayEvent.emit(false);
  }
  onClickMedium(){
    this.gameSelection = true;
    this.gameEvent.emit("medium");
    this.displayEvent.emit(false);
  }
  onClickHard(){
    this.gameSelection = true;
    this.gameEvent.emit("hard");
    this.displayEvent.emit(false);
  }
  onClickUnbeatable(){
    this.gameSelection = true;
    this.gameEvent.emit("unbeatable");
    this.displayEvent.emit(false);
  }
  onClickFour(){
    this.gameSelection = true;
    this.gameEvent.emit("four");
    this.displayEvent.emit(false);
  }
  onClickNine(){
    this.gameSelection = true;
    this.gameEvent.emit("nine");
    this.displayEvent.emit(false);
  }
  playerHuman(){
    this.playerSelection = true;
    this.playerEvent.emit("human");
    this.displayEvent.emit(false);
  }
  playerMachine(){
    this.playerSelection = true;
    this.playerEvent.emit("machine");
    this.displayEvent.emit(false);
  }
  toPlay(){
    if(this.gameSelection==true && this.playerSelection==true){
    this.displayEvent.emit(true);
    }
    else if(this.gameSelection==true && this.playerSelection==false){
      alert("Please Select the starting Player!");
       this.displayEvent.emit(false);
    }
    else if(this.gameSelection==false && this.playerSelection==true){
      alert("Please Select the Game Type!");
       this.displayEvent.emit(false);
    }
    else
    {
      alert("Please Select the starting Player and the Game Type!");
      this.displayEvent.emit(false);
    }
  }
}
