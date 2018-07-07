import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';

import { PerfilPage } from '../perfil/perfil';


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
  image;
  imgPreview;
  img;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private http: Http,
    public transfer: FileTransfer,
    public camera: Camera,
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
    this.img = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/images/upload/' + this.profile.email + '/' + this.profile.avatar
  }

  UpdateProfile() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      dismissOnPageChange: false,
      content: '<img src="assets/spinner3.gif"/>'
    });
    loading.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', this.token);

    var credentials = JSON.stringify({ image: this.image, name: this.Name, dni: this.Dni, phone: this.Phone, province: this.Province, city: this.City, domicile: this.Domicile });
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

  home(){
    this.navCtrl.push(PerfilPage);
  }

}
