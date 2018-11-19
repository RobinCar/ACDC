import { Component, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements AfterViewInit {

  @ViewChild('myCanvas')
  private myDiv: ElementRef;
  private contexte: CanvasRenderingContext2D;
  private myCanvas: HTMLCanvasElement;
  private image: HTMLImageElement;
  private path: string;
  private tempPath: string;
  private started: boolean;
  private selectionOk: boolean;
  private mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  };

  constructor(private http: HttpClient) {
    this.started = false;
  }

  ngAfterViewInit() {
    this.myCanvas = <HTMLCanvasElement>this.myDiv.nativeElement;

    this.image = new Image();
    this.contexte = this.myCanvas.getContext('2d');

    // this.image.style.display = 'none';
  }

  initCanvas() {

    this.image.src = this.path;

    this.tempPath = this.path;

    const self = this;

    this.image.onload = function() {
      self.draw();
    };

    this.image.crossOrigin = 'anonymous';
  }

  canvasTemp() {

    this.image.src = this.tempPath;

    const self = this;

    this.image.onload = function() {
      self.draw();
    };

    this.image.crossOrigin = 'anonymous';
  }

  draw() {

    this.myCanvas.width = this.image.width;
    this.myCanvas.height = this.image.height;

    this.contexte.drawImage(this.image, 0, 0);

  }

  editImage(x, y, width, height) {

    const imageData = this.contexte.getImageData(x, y, width, height);

    const data = imageData.data;

    this.setPixelsInBlack(data);

    this.contexte.putImageData(imageData, x, y);
  }

  setPixelsInBlack(data) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }

  mousedown(e) {
    if (this.selectionOk) {
      this.started = true;
      this.mouse.startX = (e.pageX - this.myCanvas.offsetLeft);
      this.mouse.startY = (e.pageY - this.myCanvas.offsetTop);
    }
  }

  mouseup(e) {
    if (this.started && this.selectionOk) {
      this.started = false;
      this.selectionOk = false;
      this.mouse.x = (e.pageX - this.myCanvas.offsetLeft);
      this.mouse.y = (e.pageY - this.myCanvas.offsetTop);
      this.editImageDependingCoordinates();
    }
  }

  editImageDependingCoordinates() {
    if (this.mouse.x < this.mouse.startX) {
      if (this.mouse.y < this.mouse.startY) {
        this.editImage(this.mouse.x, this.mouse.y, this.mouse.startX - this.mouse.x, this.mouse.startY - this.mouse.y);
      } else {
        this.editImage(this.mouse.x, this.mouse.startY, this.mouse.startX - this.mouse.x, this.mouse.y - this.mouse.startY);
      }
    } else {
      if (this.mouse.y < this.mouse.startY) {
        this.editImage(this.mouse.startX, this.mouse.y, this.mouse.x - this.mouse.startX, this.mouse.startY - this.mouse.y);
      } else {
        this.editImage(this.mouse.startX, this.mouse.startY, this.mouse.x - this.mouse.startX, this.mouse.y - this.mouse.startY);
      }
    }
    this.tempPath = this.myCanvas.toDataURL('image/jpg');
  }

  mousemove(e) {
    if (this.started && this.selectionOk) {
      this.canvasTemp();
      this.mouse.currentX = (e.pageX - this.myCanvas.offsetLeft);
      this.mouse.currentY = (e.pageY - this.myCanvas.offsetTop);
      this.drawLine();
    }
  }

  drawLine() {
    if (this.started && this.selectionOk) {
        this.contexte.setTransform(1, 0, 0, 1, 0, 0);
        this.contexte.beginPath();
        this.contexte.moveTo(this.mouse.startX, this.mouse.startY);
        this.contexte.lineTo(this.mouse.startX, this.mouse.currentY);
        this.contexte.moveTo(this.mouse.startX, this.mouse.startY);
        this.contexte.lineTo(this.mouse.currentX, this.mouse.startY);
        this.contexte.moveTo(this.mouse.currentX, this.mouse.currentY);
        this.contexte.lineTo(this.mouse.startX, this.mouse.currentY);
        this.contexte.moveTo(this.mouse.currentX, this.mouse.currentY);
        this.contexte.lineTo(this.mouse.currentX, this.mouse.startY);
        this.contexte.strokeStyle = 'gray';
        this.contexte.lineWidth = 1;
        this.contexte.stroke();
    }
  }

  setSelection() {
    this.selectionOk = true;
  }

  setPath(s: string) {
    this.clear();
    this.path = s;
    this.tempPath = s;
    this.initCanvas();
  }

  clear() {
    this.contexte.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  }

  save() {
    const img = this.myCanvas.toDataURL('image/jpg');
    // tslint:disable-next-line:max-line-length
    const iframe = '<iframe src="' + img + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>';
    const x = window;
    x.document.open();
    x.document.write(iframe);
    x.document.close();
  }
}
