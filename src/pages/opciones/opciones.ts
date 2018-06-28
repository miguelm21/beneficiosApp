import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { OneSignal } from '@ionic-native/onesignal';
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
  api = "https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/";
  onesignalId:string;

  constructor( private oneSignal: OneSignal, public navCtrl: NavController, public navParams: NavParams , public http:Http ,public menuCtrl: MenuController) {
    this.oneSignal.getIds().then((ids)=>{
       
        this.onesignalId = ids.userId;
        let localData = this.http.get(this.api+"changePermissions/"+this.onesignalId+"/false/0").map(res => res.json());
          localData.subscribe(data => {
             this.estadoPositivo = data.state == 1 ;
        });
     
        })
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
    let localData = this.http.get(this.api+"changePermissions/"+this.onesignalId+"/true/"+ this.estadoPositivo ? "1" : "0").map(res => res.json());
      localData.subscribe(data => {
        alert(data.state)
    });
     
  }

  MoveToHome(){
  	this.navCtrl.pop();
  }

}
