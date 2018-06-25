import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

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


  constructor(public navCtrl: NavController, public navParams: NavParams,public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OpcionesPage');
    this.menuCtrl.close();
  }

  change(){
  	this.Text = (this.estadoPositivo) ?  "Activar Notificaciones" : "Desactivar Notificaciones";
    this.estadoPositivo = !this.estadoPositivo; 
  }

  MoveToHome(){
  	this.navCtrl.pop();
  }

}
