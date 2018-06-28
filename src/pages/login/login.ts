import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController, Events } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { JwtHelper } from "angular2-jwt";
import { Storage } from "@ionic/storage";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  Email;
  Password;
  LOGIN_URL = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/login';
  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
  error;
  token;
  jwtHelper = new JwtHelper();
  fbid;
  userData;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http, 
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private fb: Facebook,
    public events: Events,
    private googlePlus: GooglePlus,
    public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    this.authenticate();
  }

  keytab(event) {
      let element = event.srcElement.nextElementSibling; // get the sibling element

      if(element == null)  // check if its null
          return;
      else
          element.focus();   // focus if not null
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  fblogin()
  {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>'
    });
    loading.present();
    this.fb.login(['email', 'public_profile'])
    .then((res: FacebookLoginResponse) => {

      this.fbid = res.authResponse.userID;


      this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
        loading.dismiss();
        let headers = new Headers();
          headers.append('Content-Type', 'application/json');

          var credentials = JSON.stringify({ id: this.fbid, email: this.userData.email, name: this.userData.first_name });
          this.http.post(this.api + 'auth/facebook/callback', credentials, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => {
              this.authSuccess(data.token);
              this.events.publish('user:login', data.access_token);
              loading.dismiss();
              this.navCtrl.setRoot(HomePage, { token: this.token });
            },
            err => {
              if (err.status == 401){
                loading.dismiss();
                this.toast('Inicie Sesion Nuevamente');
              } else if (err.status == 500) {
                loading.dismiss();
                this.toast('Error 1');
              } else {
                loading.dismiss();
                this.toast('Error 2');
              }   
            },
          );
      })
    .catch(e => { /*alert(e);*/ loading.dismiss(); });
      
    })
    

    /*this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(
      this.fb.api('/' + res.authResponse.userID + '?fields=id,first_name, email, name', []).then(
        profile => {
          this.userData = {email: profile['email'], first_name: profile['first_name'], username: profile['name']};
        }
      )
      .catch(e => { alert(e) });*/

      /*alert(res.authResponse.userID);*/
      

    /*this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((response: FacebookLoginResponse) => { 
      console.log('Logged into Facebook!', response); this.toast(response.authResponse.userID);
      this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        this.userData = {email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name']}
      });
      alert(this.userData);
    })
    .catch(e => { this.toast('Error al conectarse a Facebook'); });*/
  }

  gpluslogin()
  {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>'
    });
    loading.present();
    this.googlePlus.login({})
      .then(res => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var credentials = JSON.stringify({ id: res.userId, email: res.email, name: res.givenName });
        this.http.post(this.api + 'auth/google/callback', credentials, { headers: headers })
        .map(res => res.json())
        .subscribe(
          data => {
            this.authSuccess(data.token);
            this.events.publish('user:login', data.access_token);
            loading.dismiss();
            this.navCtrl.setRoot(HomePage, { token: this.token });
          },
          err => {
            if (err.status == 401){
              loading.dismiss();
              this.toast('Inicie Sesion Nuevamente');
            } else if (err.status == 500) {
              loading.dismiss();
              this.toast('Error 1');
            } else {
              loading.dismiss();
              this.toast('Error 2');
            }   
          },
        );
      })
      .catch(err => { /*alert(err); this.toast(err);*/ loading.dismiss(); });
  }

  me () {
    let headers = new Headers();
    headers.append('Authorization', 'Basic Z29vZGNvbWV4OmNvbWV4MDA=');
    headers.append('Authorization', this.token);
    headers.append('Content-Type', 'application/json');

    this.http.get(this.api + 'me', { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => {
          this.authenticate();
        },
        err => {
          if (err.status == 401){
            this.toast('Inicie Sesion Nuevamente');
          } else if (err.status == 500) {
            
          } else {
            
          }   
        },
      );
  }

  login() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>'
    });
    loading.present();

    let headers = new Headers();
    /*headers.append('Authorization', 'Basic Z29vZGNvbWV4OmNvbWV4MDA=');*/
    headers.append('Content-Type', 'application/json');

    var credentials = JSON.stringify({ email: this.Email, password: this.Password });
    this.http.post('https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/login', credentials, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { this.authSuccess(data.access_token); this.events.publish('user:login', data.access_token); this.navCtrl.setRoot(HomePage, { token: this.token }); loading.dismiss(); },
        err => {
          loading.dismiss();
          if (err.status == 401){
            this.toast('Credenciales Incorrectas');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
        },
      );
  }

  authenticate() {
    this.storage.get('token').then( data => {
      if(data != null) {
        if(data == 'token_expired') {

        }
        else if(data == undefined) {

        }
        else {
          this.navCtrl.setRoot(HomePage, { token: data });
        }
      }
    });
  }

  authSuccess(token) {
    this.error = null;
    this.storage.set('token', token);
    this.token = token;
    var sub = this.jwtHelper.decodeToken(token).sub;
    this.storage.set('profile', sub);
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
