import { Component, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-leftbar',
  templateUrl: './leftbar.component.html',
  styleUrls: ['./leftbar.component.css']
})
export class LeftbarComponent implements OnInit {

  @Output() childEvent = new EventEmitter<Boolean>();
  game = false;

  constructor() { }

  ngOnInit(): void {
  }


  onClick(){
    console.log("Button Clicked");
  }
}
