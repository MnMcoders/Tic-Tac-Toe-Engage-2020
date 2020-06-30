import { Component, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {

  @Output() childEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

<<<<<<< HEAD
  onClickEasy(){
    this.childEvent.emit("easy");
  }
  onClickMedium(){
    this.childEvent.emit("medium");
  }
  onClickHard(){
    this.childEvent.emit("hard");
  }
  onClickFour(){
    this.childEvent.emit("four");
  }
  onClickNine(){
    this.childEvent.emit("nine");
  }

=======

  onClick(){
    console.log("Button Clicked");
  }
>>>>>>> 66f9a409d8a037aaf4338b0b1300b8befcbbf941
}
