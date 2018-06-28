import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Injectable } from '@angular/core';

/**
 * Generated class for the OpcionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-opciones',
  templateUrl: 'opciones.html',
})
export class OpcionesPage {
	Notificaciones = "true";
	Text: string = "Activar notificaciones";
	estadoPositivo: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController, public storage:Storage) {
    this.storage.get("notificationPermission").then((Data)=>{
      //alert(Data)
      this.estadoPositivo = Data === "true" || Data === null;
    })
  }
  static get parameters() { return [[NavController], [Storage], [MenuController], [NavParams], [NavController]]; }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OpcionesPage');
    this.menuCtrl.close();
  }

  change(){
    this.estadoPositivo = !this.estadoPositivo; 
    this.storage.set("notificationPermission", (this.estadoPositivo) ?  "true" : "false").then((data)=>{
     // alert(data)
    })
    /*this.storage.get("notificationPermission").then((Data)=>{
      
      alert(Data);
      

    })*/

  }

  MoveToHome(){
  	this.navCtrl.pop();
  }

}
