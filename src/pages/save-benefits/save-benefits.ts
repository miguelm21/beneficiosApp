import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer'
import { Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";

import { LoginPage } from '../login/login';

/**
 * Generated class for the SaveBenefitsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-save-benefits',
  templateUrl: 'save-benefits.html',
})
export class SaveBenefitsPage {
  _imageViewerCtrl: ImageViewerController;
  benefits: Object[];
  token;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
  	public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public toastCtrl: ToastController,
    imageViewerCtrl: ImageViewerController,
    public menuCtrl: MenuController,
    public storage: Storage,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
  	this.menuCtrl.close();
    /*console.log('ionViewDidLoad SaveBenefitsPage');*/
  }

  ionViewWillEnter() {
  	this.storage.get('token').then( data => {
      if(data != null) {
        if(data == 'token_expired') {
          this.navCtrl.setRoot(LoginPage);
        }
        else if(data == undefined) {
          this.navCtrl.setRoot(LoginPage);
        }
        else if(data == 'Unauthenticated.') {
          this.navCtrl.setRoot(LoginPage);
        }
        else {
          this.token = 'Bearer' + data;
          var token = 'Bearer' + data;
          this.getBenefits(token);
        }
      }
    });
  }

  getBenefits(token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: true
    });

    loading.present();
    
    let headers = new Headers();
    /*headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');*/
    headers.append('Authorization', token);

    this.http.get(this.api + 'savebenefits', { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => {
          this.benefits = data.userbenefits.data;
          console.log(data.userbenefits.data);
          loading.dismiss();
        },
        err => {
          loading.dismiss();
          if (err.status == 401){
            this.toast('No se encontraron datos');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }   
        },
      );
  }

  presentImage(myImage) {
    const imageViewer = this._imageViewerCtrl.create(myImage);
    imageViewer.present();
  }

  home(){
  	this.navCtrl.popToRoot();
  }

  toast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
