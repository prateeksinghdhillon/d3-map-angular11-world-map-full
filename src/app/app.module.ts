import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BidiModule } from '@angular/cdk/bidi';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './shared/map/map.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [ BidiModule, BrowserModule, CommonModule, FormsModule, HttpClientModule ],
  declarations: 
  [ 
    AppComponent, 
    MapComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
