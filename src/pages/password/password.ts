import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";

import { LoginPage } from '../login/login';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {

  token;
  profile;

  Oldpassword;
  Password;
  PasswordConfirmation;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private http: Http,
    public storage: Storage,
    public menuCtrl: MenuController) {
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
    console.log(this.profile);
  }

  getProfile(token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: false
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

  UpdatePassword() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: false
    });
    loading.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', this.token);

    var credentials = JSON.stringify({ old_password: this.Oldpassword, password: this.Password, password_confirmation: this.PasswordConfirmation });
    this.http.put(this.api +'updatepassword/' + this.profile.id, credentials, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { loading.dismiss(); this.toast('Contraseña actualizada con exito'); this.logout(); },
        err => {
          loading.dismiss();
          if (err.status == 401){
            this.toast('Contraseña Actual Incorrecta');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
        },
      );
  }

  logout() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: false
    });
    loading.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', this.token);

    this.http.post(this.api + 'logout', { }, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { this.navCtrl.setRoot(LoginPage); this.storage.remove('token'); this.storage.remove('profile'); loading.dismiss(); },
        err => { 
          if (err.status == 401){
            this.storage.remove('token');
            this.storage.remove('profile');
            this.storage.remove('username');
            this.navCtrl.push(LoginPage);
          } else if (err.status == 400) {
            this.toast('Su usuario ha sido deshabilitado');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
          loading.dismiss();
        },
      );
  }

  back(){
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
