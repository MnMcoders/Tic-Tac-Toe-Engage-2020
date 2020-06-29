import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { MainGameComponent } from './main-game/main-game.component';
import { ThreeEasyComponent } from './three-easy/three-easy.component';
import { ThreeMediumComponent } from './three-medium/three-medium.component';
import { ThreeHardComponent } from './three-hard/three-hard.component';
import { FourXfourComponent } from './four-xfour/four-xfour.component';
import { NineXnineComponent } from './nine-xnine/nine-xnine.component';
import { BoardComponent } from './board/board.component';
import { CellComponent } from './cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    LeftbarComponent,
    RightbarComponent,
    MainGameComponent,
    ThreeEasyComponent,
    ThreeMediumComponent,
    ThreeHardComponent,
    FourXfourComponent,
    NineXnineComponent,
    BoardComponent,
    CellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
