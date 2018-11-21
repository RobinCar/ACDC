import { Component, AfterViewInit } from '@angular/core';
import { ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})

export class CanvasComponent implements AfterViewInit {

  // Element contenant le canvas
  @ViewChild('myCanvas')
  private myDiv: ElementRef;
  // Le contexte du canvas
  private contexte: CanvasRenderingContext2D;
  // Le canvas
  private myCanvas: HTMLCanvasElement;
  // L'image qui sera intégrée au canvas
  private image: HTMLImageElement;
  // Le path de l'image
  private path: string;
  // Un path temporaire, j'expliquerais plus loin son utilité
  private tempPath: string;
  // Savoir si l'utilisateur a commencé à sélectionner une zone
  private started: boolean;
  // Permet de sation si l'utilisateur est en train de sélectionner une zone
  private editionOK: boolean;
  // Permet de connaître différentes coordonnées du curseur : l'orgine, courant, finale
  private mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  };

  constructor() {
    this.started = false;
  }

  // Récupération du canvas et du contexte après initialisation du composant
  ngAfterViewInit() {
    this.myCanvas = <HTMLCanvasElement>this.myDiv.nativeElement;

    this.image = new Image();
    this.contexte = this.myCanvas.getContext('2d');
  }

  // Initialisation du canvas
  initCanvas() {
    // Mise à jour source de l'image
    this.image.src = this.path;
    this.tempPath = this.path;

    // Objet this pour l'utiliser dans le onload de l'image
    const self = this;

    this.image.onload = function() {
      self.draw();
    };

    // Permet d'éviter les erreurs de sécurité sur l'image
    this.image.crossOrigin = 'anonymous';
  }

  // Initialisation en utilisant le tempPath
  // Le tempPath permet de supprimer les tracés du rectangle de sélection, en redessinant l'image sur le canvas depuis un url précédent
  canvasTemp() {

    this.image.src = this.tempPath;

    const self = this;

    this.image.onload = function() {
      self.draw();
    };

    this.image.crossOrigin = 'anonymous';
  }

  // Affichage de l'image sur le canvas
  draw() {

    this.myCanvas.width = this.image.width;
    this.myCanvas.height = this.image.height;

    this.contexte.drawImage(this.image, 0, 0);

  }

  // Permet de mettre en noir la zone sélectionnée par l'utilisateur
  editImage(x, y, width, height) {
    // Récupération de la zone
    const imageData = this.contexte.getImageData(x, y, width, height);
    // Récupération des pixels
    const data = imageData.data;

    this.setPixelsInBlack(data);
    // Réécriture de la zone sur le canvas
    this.contexte.putImageData(imageData, x, y);
  }

  // Change la couleur des pixels en noir
  setPixelsInBlack(data) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }

  // Si l'utilisateur appuie sur sa souris alors qu'il est en mode edition
  // La sélection de la zone à cacher commence en initialisant les coordonnées de la souris
  mousedown(e) {
    if (this.editionOK) {
      this.started = true;
      this.mouse.startX = (e.pageX - this.myCanvas.offsetLeft);
      this.mouse.startY = (e.pageY - this.myCanvas.offsetTop);
    }
  }

  // Si l'utilisateur relache le bouton de sa souris alors qu'il est en mode edition
  // Modification de l'image
  // Fin de l'édition
  mouseup(e) {
    if (this.started && this.editionOK) {
      this.started = false;
      this.editionOK = false;
      this.mouse.x = (e.pageX - this.myCanvas.offsetLeft);
      this.mouse.y = (e.pageY - this.myCanvas.offsetTop);
      this.editImageDependingCoordinates();
    }
  }

  // Edition de l'image en fonciton des coordonnées
  // Si xFin < xDebut ...
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
    // Path temporaire prend la valeur de l'image après édition
    this.tempPath = this.myCanvas.toDataURL('image/jpg');
  }

  // Si l'utilisateur a commencé à sélectionner
  // Affichage d'un rectangle pour que l'utilisateur puisse voir ce qu'il sélectionne
  mousemove(e) {
    if (this.started && this.editionOK) {
      // Réinitialisation du canvas avec le path temporaire pour effacer les anciens tracés du rectangle
      this.canvasTemp();
      this.mouse.currentX = (e.pageX - this.myCanvas.offsetLeft);
      this.mouse.currentY = (e.pageY - this.myCanvas.offsetTop);
      this.drawLine();
    }
  }

  // Affichage du rectangle
  drawLine() {
    if (this.started && this.editionOK) {
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

  // Permet de dire que l'utilisateur veut sélectionner une zone
  setEdition() {
    this.editionOK = true;
  }

  // Modification du path lors du chargement d'un image
  setPath(s: string) {
    this.path = s;
    this.initCanvas();
  }

  // Nettoyage du canvas
  clear() {
    this.contexte.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  }

  getCanvas() {
    return this.myCanvas;
  }
}
