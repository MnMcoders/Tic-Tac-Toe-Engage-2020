import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { ThreeEasyComponent } from './three-easy/three-easy.component';
import { FourXfourComponent } from './four-xfour/four-xfour.component';
import { NineXnineComponent } from './nine-xnine/nine-xnine.component';
import { CellComponent } from './cell/cell.component';
import { RulesComponent } from './rules/rules.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    LeftbarComponent,
    ThreeEasyComponent,
    FourXfourComponent,
    NineXnineComponent,
    CellComponent,
    RulesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
