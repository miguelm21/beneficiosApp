var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, LoadingController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from "@angular/http";
import { Storage } from "@ionic/storage";
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { PerfilPage } from '../pages/perfil/perfil';
import { LoginPage } from '../pages/login/login';
import { OpcionesPage } from '../pages/opciones/opciones';
import { PasswordPage } from '../pages/password/password';
import { SaveBenefitsPage } from '../pages/save-benefits/save-benefits';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, events, splashScreen, http, loadingCtrl, toastCtrl, storage) {
        var _this = this;
        this.events = events;
        this.splashScreen = splashScreen;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.rootPage = HomePage;
        this.api = 'http://192.168.0.103/Activos/beneficios/public/api/';
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            _this.hideSplashScreen();
        });
        this.pages = [
            { title: 'Login', component: LoginPage },
            { title: 'Register', component: RegisterPage },
            { title: 'Perfil', component: PerfilPage },
            { title: 'Contraseña', component: PasswordPage },
            { title: 'Opciones', component: OpcionesPage },
            { title: 'Beneficios Guardados', component: SaveBenefitsPage },
        ];
        this.storage.get('token').then(function (data) {
            if (data != null) {
                _this.token = 'Bearer' + data;
            }
            else if (data == null) {
                _this.token = null;
            }
        }).catch(function (err) {
            _this.token = null;
        });
        console.log(this.token);
        events.subscribe('user:login', function (token) {
            _this.token = token;
        });
    }
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.push(page.component);
    };
    MyApp.prototype.logout = function () {
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
    };
    MyApp.prototype.hideSplashScreen = function () {
        var _this = this;
        if (this.splashScreen) {
            setTimeout(function () {
                _this.splashScreen.hide();
            }, 100);
        }
    };
    MyApp.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            Events,
            SplashScreen,
            Http,
            LoadingController,
            ToastController,
            Storage])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map