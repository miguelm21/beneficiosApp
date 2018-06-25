import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from "@angular/http";

import { LoginPage } from '../login/login';

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

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public http: Http, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner2.gif"/>'
    });
    loading.present();
    loading.dismiss();
    console.log('ionViewDidLoad RegisterPage');
    this.menuCtrl.close();
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

  register() {
    if(this.Password == this.Password_confirmation)
    {
      var loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: '<img src="../../assets/spinner3.gif"/>'
      });
      loading.present();

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('X-Requested-With', 'XMLHttpRequest');

      var credentials = JSON.stringify({ name: this.Name, dni: this.Dni, email: this.Email, phone: this.Phone, province: this.Province, city: this.City, domicile: this.Domicile, password: this.Password });
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
