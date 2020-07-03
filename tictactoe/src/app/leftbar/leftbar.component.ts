import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { logWarnings } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {

  @Output() childEvent = new EventEmitter<string>();
  @Output() playerEvent = new EventEmitter<string>();
  @Output() displayEvent = new EventEmitter<boolean>();

  public gameSelection;
  public playerSelection;

  constructor() { }

  ngOnInit(): void {
  }

  onClickEasy(){
    this.gameSelection = true;
    this.childEvent.emit("easy");
    this.displayEvent.emit(false);
  }
  onClickMedium(){
    this.gameSelection = true;
    this.childEvent.emit("medium");
    this.displayEvent.emit(false);
  }
  onClickHard(){
    this.gameSelection = true;
    this.childEvent.emit("hard");
    this.displayEvent.emit(false);
  }
  onClickUnbeatable(){
    this.gameSelection = true;
    this.childEvent.emit("unbeatable");
    this.displayEvent.emit(false);
  }
  onClickFour(){
    this.gameSelection = true;
    this.childEvent.emit("four");
    this.displayEvent.emit(false);
  }
  onClickNine(){
    this.gameSelection = true;
    this.childEvent.emit("nine");
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
    else{
      console.log("Please Select all the options!");
       this.displayEvent.emit(false);
    }
  }
}
