import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
@Injectable()
export class NavBarComponent implements OnInit {

  @ViewChild(CanvasComponent) canvas: CanvasComponent;
  private selection: boolean;
  private paths: string[];

  constructor(private http: HttpClient) {

    this.selection = false;
    this.paths = [
      'identicon.png',
      'shaka.png'
    ];
  }

  ngOnInit() {
  }

  setSelection() {
    this.canvas.setSelection();
  }

  setPath(s: string) {
    this.selection = false;
    this.canvas.setPath(s);
  }

  restore() {
    this.canvas.initCanvas();
  }

  setSelectionOk() {

    this.setPath('http://127.0.0.1:8000/identicon.png');

    // console.log(this.canvas);
    // this.canvas.clear();
    // this.selection = true;
  }

}