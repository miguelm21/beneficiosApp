import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

/**
 * Generated class for the EditperfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editperfil',
  templateUrl: 'editperfil.html',
})
export class EditperfilPage {

  token;
  profile;

  Name;
  Dni;
  Phone;
  Province;
  City;
  Domicile;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private http: Http,
    public loadingCtrl: LoadingController) {
  }

  ionViewWillEnter() {
    this.token = this.navParams.get('token');
    this.profile = this.navParams.get('profile');

    this.Name = this.profile.name;
    this.Dni = this.profile.dni;
    this.Phone = this.profile.phone;
    this.Province = this.profile.province;
    this.City = this.profile.city;
    this.Domicile = this.profile.domicile;
  }

  UpdateProfile() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>'
    });
    loading.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', this.token);

    var credentials = JSON.stringify({ name: this.Name, dni: this.Dni, phone: this.Phone, province: this.Province, city: this.City, domicile: this.Domicile });
    this.http.put(this.api +'updateprofile/' + this.profile.id, credentials, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { loading.dismiss(); this.toast('Perfil actualizado con exito'); },
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
