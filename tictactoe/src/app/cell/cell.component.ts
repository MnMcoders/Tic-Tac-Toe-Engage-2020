import { Component, OnInit, Input} from '@angular/core';
import { Cellenum } from './cellenum.enum';


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Input() row : number;
  @Input() col : number;
  @Input() piece : Cellenum = Cellenum.EMPTY;

  constructor() { }

  ngOnInit(): void {
  }

}
