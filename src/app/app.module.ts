import { BrowserModule } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CanvasComponent } from './canvas/canvas.component';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    BsDropdownModule.forRoot(),
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyD-jXTeGUftTOfyxcNo3H9VClkIG23DEcI',
      authDomain: 'acdc-5dabc.firebaseapp.com',
      databaseURL: 'https://acdc-5dabc.firebaseio.com',
      projectId: 'acdc-5dabc',
      storageBucket: 'acdc-5dabc.appspot.com',
      messagingSenderId: '592267955636'
    }),
    AngularFireStorageModule,
    AngularFireDatabaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
