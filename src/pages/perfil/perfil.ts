import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer'
import { Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";
import { DomSanitizer} from '@angular/platform-browser';

import { LoginPage } from '../login/login';
import { EditperfilPage } from '../editperfil/editperfil';
import { PasswordPage } from '../password/password';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  _imageViewerCtrl: ImageViewerController;
  profile;
  token;
  image;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    imageViewerCtrl: ImageViewerController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public sanitizer: DomSanitizer,
    private http: Http,
    public loadingCtrl: LoadingController) {
       this._imageViewerCtrl = imageViewerCtrl; 
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
  }

  ionViewWillEnter() {
    this.storage.get('token').then( data => {
      if(data != null) {
        if(data == 'token_expired') {
          console.log('a');
          this.navCtrl.setRoot(LoginPage);
        }
        else if(data == undefined) {
          console.log('b');
          this.navCtrl.setRoot(LoginPage);
        }
        else if(data == 'Unauthenticated.') {
          console.log('c');
          this.navCtrl.setRoot(LoginPage);
        }
        else {
          console.log('d');
          this.token = 'Bearer ' + data;
          var token = 'Bearer ' + data;
          this.getProfile(token);
        }
      }
    });
    
  }

  getProfile(token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: true
    });

    loading.present();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', token);

    this.http.post(this.api + 'me', {}, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => {
          this.profile = data;
          this.image = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + this.profile.avatar);
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

  EditProfile(){
    this.navCtrl.push(EditperfilPage, { profile: this.profile, token: this.token });
  }

  ChangePassword(){
    this.navCtrl.push(PasswordPage, { profile: this.profile, token: this.token } );
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


