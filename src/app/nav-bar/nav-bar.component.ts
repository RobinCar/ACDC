import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { MyImage } from '../MyImage';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

@Injectable()
export class NavBarComponent implements OnInit {

  // Le canvas afin d'appeler les méthodes en fonction des boutons de la barre de menu
  @ViewChild(CanvasComponent) canvas: CanvasComponent;

  // Boolean qui permet de savoir si l'utilisateur est en train de sélectionner une image ou non
  private selection: boolean;

  // La liste des MyImage stockées dans la base de données Firebase
  private images: any;

  // Constructeur permet d'obtenir les objets pour le storage et la base de données Firebase
  constructor(private afStorage: AngularFireStorage, private db: AngularFireDatabase) {
  }

  // Méthode à l'initialisation du composant
  ngOnInit() {
    // Récupération de la liste des images stockées dans la base de donnée Firebase
    this.getAllFiles();
    // Par défaut l'utilisateur veut sélectionner un fihcier à importer
    this.selection = true;
  }

  // Méthode permettant de dire au canvas que l'utilisateur veut éditer l'image
  setEdition() {
    this.canvas.setEdition();
  }

  // Méthode permettant de définir un nouveau path pour l'image
  // Elle est appelée quand l'utilisateur a fini de sélectionner une image
  setPath(s: string) {
    this.selection = false;
    this.canvas.setPath(s);
  }

  // Méthode demandant au canvas de restaurer l'image
  restore() {
    this.canvas.initCanvas();
  }

  // Méthode appelée lorsque l'utilisateur veut sélectionner une autre image
  setSelectionOk() {
    // Nettoyage du canvas, on enlève l'image qu'il y avait avant
    this.canvas.clear();
    this.selection = true;
  }

  // Méthode appelée lorsque l'utilisateur vut exporter l'image vers le storage Firebase
  upload() {
    // Génération d'un ID aléatoire
    const id = Math.random().toString(36).substring(2);
    let ref: AngularFireStorageReference;
    ref = this.afStorage.ref(id);
    // Récupération de l'image du canvas
    const img = this.canvas.getCanvas().toDataURL('image/jpg');
    let task: AngularFireUploadTask;
    // Envoie de l'image vers le storage
    task = ref.put(this.dataURItoBlob(img));
    // Sauvegarde de l'ID et de l'URL de l'image dans la base de donnée Firebase
    this.db.list('/Images').push(new MyImage(id, this.canvas.getCanvas().toDataURL('image/jpg')));

    alert('Image sauvegardée sur Firebase');
  }

  // Méthode permettant d'obtenir la liste des images depuis la base de données Firebase
  getAllFiles() {
    this.images = this.db.list('/Images').valueChanges();
  }

  // Méthode permettant de convertir l'URL de l'image du canvas en Blob pour ensuite sauvegarder l'image
  dataURItoBlob(dataURI) {
    // Convertion de l'url encodé en base 64 en une ligne de données binaires dans un string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }
    // Separation des différents composants du string
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // Ecriture des bytes du string dans un tableau
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
  }

}
