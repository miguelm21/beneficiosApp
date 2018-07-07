import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController, Events } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { JwtHelper } from "angular2-jwt";
import { Storage } from "@ionic/storage";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  Name;
  Dni;
  Email;
  Phone;
  Province;
  City;
  Domicile;
  Password;
  Password_confirmation;

  token;
  fbid;
  userData;
  jwtHelper = new JwtHelper();
  imgPreview
  image
  error

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public http: Http, 
    public toastCtrl: ToastController,
    private fb: Facebook,
    public events: Events,
    private googlePlus: GooglePlus,
    public transfer: FileTransfer,
    public camera: Camera,
    public storage: Storage,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner2.gif"/>',
      dismissOnPageChange: true
    });
    loading.present();
    loading.dismiss();
    console.log('ionViewDidLoad RegisterPage');
    this.menuCtrl.close();
  }

  lookingPhoto(){
      const options: CameraOptions = {
        quality: 35,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: false
      }

      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.imgPreview = 'data:image/jpeg;base64,' + imageData;
        this.image = imageData;
      }, (err) => {
         // Handle error
         console.error('Error en la camara', + err);
       }
     );
  }

  keytab(event){
    let element = event.srcElement.nextElementSibling; // get the sibling element

    if(element == null)  // check if its null
        return;
    else
        element.focus();   // focus if not null
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  fblogin()
  {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: true
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

          var credentials = JSON.stringify({ image: this.userData.picture, id: this.fbid, email: this.userData.email, name: this.userData.first_name });
          this.http.post(this.api + 'auth/facebook/callback', credentials, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => {
              this.authSuccess(data.token, data.user);
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
      content: '<img src="assets/spinner3.gif"/>',
      dismissOnPageChange: true
    });
    loading.present();
    this.googlePlus.login({})
      .then(res => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        var credentials = JSON.stringify({ id: res.userId, email: res.email, name: res.givenName, image: res.imageUrl });
        this.http.post(this.api + 'auth/google/callback', credentials, { headers: headers })
        .map(res => res.json())
        .subscribe(
          data => {
            this.authSuccess(data.token, data.user);
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

  authSuccess(token, user) {
    this.error = null;
    this.storage.set('token', token);
    this.storage.set('username', user);
    this.token = token;
    var sub = this.jwtHelper.decodeToken(token).sub;
    this.storage.set('profile', sub);
  }

  register() {
    if(this.Password == this.Password_confirmation)
    {
      var loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: '<img src="../../assets/spinner3.gif"/>',
        dismissOnPageChange: false
      });
      loading.present();

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('X-Requested-With', 'XMLHttpRequest');

      var credentials = JSON.stringify({ image: this.image, name: this.Name, dni: this.Dni, email: this.Email, phone: this.Phone, province: this.Province, city: this.City, domicile: this.Domicile, password: this.Password });
      this.http.post(this.api + 'register', credentials, { headers: headers })
        .map(res => res.json())
        .subscribe(
          data => { this.toast('Registro exitoso'); this.navCtrl.push(LoginPage); loading.dismiss(); },
          err => {
            loading.dismiss();
            if (err.status == 401){
              this.toast('No se encontro el usuario');
            } else if (err.status == 500) {
              this.toast('Ocurrio un error');
            } else {
              this.toast('Ocurrio un error');
            }
          },
        );
    }
    else
    {
      this.toast('Las contraseñas no coinciden');
    }
    
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
