import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { RightbarComponent } from './rightbar/rightbar.component';
import { ThreeEasyComponent } from './three-easy/three-easy.component';
import { FourXfourComponent } from './four-xfour/four-xfour.component';
import { NineXnineComponent } from './nine-xnine/nine-xnine.component';
import { CellComponent } from './cell/cell.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    LeftbarComponent,
    RightbarComponent,
    ThreeEasyComponent,
    FourXfourComponent,
    NineXnineComponent,
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
