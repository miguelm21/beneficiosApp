import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Slides, LoadingController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http, Headers } from "@angular/http";
import { Storage } from "@ionic/storage";
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
  token;
  user;

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
    public iab: InAppBrowser,
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

    /*this.storage.get('token').then( data => {
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

    this.storage.get('username').then( data => {
      if(data != null)
      {
        this.user = data;
      }
      else if(data == null)
      {
        this.user = null;
      }
    }).catch(err => {
      this.user = null;
    });*/

    events.subscribe('user:login', (token, user) => {
      this.token = token;
      this.user = user;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  saveBenefits() {
    this.nav.push(SaveBenefitsPage);
  }

  logout() {
    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="assets/spinner3.gif"/>'
    });
    loading.present();

    this.storage.remove('token');
    this.storage.remove('profile');
    this.storage.remove('username');
    this.token = null;
    this.user = null;
    this.nav.setRoot(HomePage);
    loading.dismiss();
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

  openWeb() {
    const browser = this.iab.create('https://clubbeneficiosuno.goodcomex.com/beneficios/public');
    browser.show();
  }
    
}

