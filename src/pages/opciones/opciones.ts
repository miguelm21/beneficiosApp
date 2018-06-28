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
	Text: string = "Activar notificaciones";
	estadoPositivo: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController, public storage:Storage) {
    this.storage.get("notificationPermission").then((Data)=>{
      this.estadoPositivo = Data === "true" || Data === null;
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad OpcionesPage');
    this.menuCtrl.close();
  }

  change(){

    this.estadoPositivo = !this.estadoPositivo; 
    //alert(this.estadoPositivo)
  }
  ionViewDidLeave(){
    this.storage.set("notificationPermission", (this.estadoPositivo) ?  "true" : "false").then((data)=>{});
  }

  MoveToHome(){
  	this.navCtrl.pop();
  }

}
