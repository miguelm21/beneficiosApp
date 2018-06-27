import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
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
	Text: string = "Desactivar Notificaciones";
	estadoPositivo: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController, public storage:Storage) {
    this.storage.get("notificationPermission").then((Data)=>{
      
      this.estadoPositivo = Data === "true" || Data === null;
      this.Text = (!this.estadoPositivo) ?  "Activar Notificaciones" : "Desactivar Notificaciones";

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpcionesPage');
    this.menuCtrl.close();
  }

  change(){
  	this.Text = (this.estadoPositivo) ?  "Activar Notificaciones" : "Desactivar Notificaciones";
    this.estadoPositivo = !this.estadoPositivo; 
    this.storage.set("notificationPermission", (this.estadoPositivo) ?  "true" : "false")
   

  }

  MoveToHome(){
  	this.navCtrl.pop();
  }

}
