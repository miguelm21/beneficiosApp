import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Slides, LoadingController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, Headers } from "@angular/http";
import { Storage } from "@ionic/storage";

import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { PerfilPage } from '../pages/perfil/perfil';
import { LoginPage } from '../pages/login/login';
import { OpcionesPage } from '../pages/opciones/opciones';
import { PasswordPage } from '../pages/password/password';
import { SaveBenefitsPage } from '../pages/save-benefits/save-benefits';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  token

  pages: Array<{ title: string, component: any }>;

  api = 'http://192.168.0.103/Activos/beneficios/public/api/';

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    public events: Events,
    public splashScreen: SplashScreen,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      this.hideSplashScreen();
    });

    this.pages = [
      { title: 'Login', component: LoginPage },
      { title: 'Register', component: RegisterPage },
      { title: 'Perfil', component: PerfilPage },
      { title: 'Contraseña', component: PasswordPage },
      { title: 'Opciones', component: OpcionesPage },
      { title: 'Beneficios Guardados', component: SaveBenefitsPage },
    ];

    this.storage.get('token').then( data => {
      if(data != null)
      {
        this.token = 'Bearer ' + data;
      }
      else if(data == null)
      {
        this.token = null;
      }
    }).catch(err => {
      this.token = null;
    });

    console.log(this.token);

    events.subscribe('user:login', (token) => {
      this.token = token;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  logout() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>'
    });
    loading.present();

    this.storage.remove('token');
    this.storage.remove('profile');
    this.token = null;
    this.nav.setRoot(HomePage);
    loading.dismiss();

    /*let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', this.token);

    this.http.post(this.api + 'logout', {}, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { this.nav.setRoot(HomePage); this.storage.remove('token'); this.storage.remove('profile'); loading.dismiss(); },
        err => { 
          if (err.status == 401){
            this.storage.remove('token');
            this.storage.remove('profile');
            this.nav.setRoot(HomePage);
          } else if (err.status == 400) {
            this.toast('Su usuario ha sido deshabilitado');
            this.storage.remove('token');
            this.storage.remove('profile');
            this.nav.setRoot(HomePage);
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
            this.storage.remove('token');
            this.storage.remove('profile');
            this.nav.setRoot(HomePage);
          } else {
            this.toast('Ocurrio un error');
            this.storage.remove('token');
            this.storage.remove('profile');
            this.nav.setRoot(HomePage);
          }
          loading.dismiss();
        },
      );*/
  }

  hideSplashScreen() {
    if (this.splashScreen) {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
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

  // navigateToBuscar(){
  //   this.nav.push('HomePage', {param1: '1'});
  // }
  // navigateToBeneficios(){
  //   this.nav.push('HomePage', {param1: '2'});
  // }
  // navigateToNovedades(){
  //   this.nav.push('HomePage', {param1: '3'});
  // }


  // onSegmentChange(event)
  // {
  //     if(event)
  //     {
  //         this.nav.push('HomePage', {param1: '1'});
  //         console.log(event);
          
  //     }
  //     this.initMap();
  // }
    
}

