var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ToastController, Events } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { JwtHelper } from "angular2-jwt";
import { Storage } from "@ionic/storage";
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, http, storage, loadingCtrl, toastCtrl, fb, events, googlePlus, menuCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.storage = storage;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.fb = fb;
        this.events = events;
        this.googlePlus = googlePlus;
        this.menuCtrl = menuCtrl;
        this.LOGIN_URL = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/login';
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
        this.jwtHelper = new JwtHelper();
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        this.menuCtrl.close();
        this.authenticate();
    };
    LoginPage.prototype.keytab = function (event) {
        var element = event.srcElement.nextElementSibling; // get the sibling element
        if (element == null) // check if its null
            return;
        else
            element.focus(); // focus if not null
    };
    LoginPage.prototype.register = function () {
        this.navCtrl.push(RegisterPage);
    };
    LoginPage.prototype.fblogin = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/spinner3.gif"/>'
        });
        loading.present();
        this.fb.login(['email', 'public_profile'])
            .then(function (res) {
            _this.fbid = res.authResponse.userID;
            _this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(function (profile) {
                _this.userData = { email: profile['email'], first_name: profile['first_name'], picture: profile['picture_large']['data']['url'], username: profile['name'] };
                loading.dismiss();
                var headers = new Headers();
                headers.append('Content-Type', 'application/json');
                var credentials = JSON.stringify({ id: _this.fbid, email: _this.userData.email, name: _this.userData.first_name });
                _this.http.post(_this.api + 'auth/facebook/callback', credentials, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .subscribe(function (data) {
                    _this.authSuccess(data.token);
                    _this.events.publish('user:login', data.access_token);
                    loading.dismiss();
                    _this.navCtrl.setRoot(HomePage, { token: _this.token });
                }, function (err) {
                    if (err.status == 401) {
                        loading.dismiss();
                        _this.toast('Inicie Sesion Nuevamente');
                    }
                    else if (err.status == 500) {
                        loading.dismiss();
                        _this.toast('Error 1');
                    }
                    else {
                        loading.dismiss();
                        _this.toast('Error 2');
                    }
                });
            })
                .catch(function (e) { /*alert(e);*/ loading.dismiss(); });
        });
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
    };
    LoginPage.prototype.gpluslogin = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/spinner3.gif"/>'
        });
        loading.present();
        this.googlePlus.login({})
            .then(function (res) {
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            var credentials = JSON.stringify({ id: res.userId, email: res.email, name: res.givenName });
            _this.http.post(_this.api + 'auth/google/callback', credentials, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                _this.authSuccess(data.token);
                _this.events.publish('user:login', data.access_token);
                loading.dismiss();
                _this.navCtrl.setRoot(HomePage, { token: _this.token });
            }, function (err) {
                if (err.status == 401) {
                    loading.dismiss();
                    _this.toast('Inicie Sesion Nuevamente');
                }
                else if (err.status == 500) {
                    loading.dismiss();
                    _this.toast('Error 1');
                }
                else {
                    loading.dismiss();
                    _this.toast('Error 2');
                }
            });
        })
            .catch(function (err) { /*alert(err); this.toast(err);*/ loading.dismiss(); });
    };
    LoginPage.prototype.me = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Authorization', 'Basic Z29vZGNvbWV4OmNvbWV4MDA=');
        headers.append('Authorization', this.token);
        headers.append('Content-Type', 'application/json');
        this.http.get(this.api + 'me', { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.authenticate();
        }, function (err) {
            if (err.status == 401) {
                _this.toast('Inicie Sesion Nuevamente');
            }
            else if (err.status == 500) {
            }
            else {
            }
        });
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/spinner3.gif"/>'
        });
        loading.present();
        var headers = new Headers();
        /*headers.append('Authorization', 'Basic Z29vZGNvbWV4OmNvbWV4MDA=');*/
        headers.append('Content-Type', 'application/json');
        var credentials = JSON.stringify({ email: this.Email, password: this.Password });
        this.http.post('https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/login', credentials, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.authSuccess(data.access_token); _this.events.publish('user:login', data.access_token); _this.navCtrl.setRoot(HomePage, { token: _this.token }); loading.dismiss(); }, function (err) {
            loading.dismiss();
            if (err.status == 401) {
                _this.toast('Credenciales Incorrectas');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    LoginPage.prototype.authenticate = function () {
        var _this = this;
        this.storage.get('token').then(function (data) {
            if (data != null) {
                if (data == 'token_expired') {
                }
                else if (data == undefined) {
                }
                else {
                    _this.navCtrl.setRoot(HomePage, { token: data });
                }
            }
        });
    };
    LoginPage.prototype.authSuccess = function (token) {
        this.error = null;
        this.storage.set('token', token);
        this.token = token;
        var sub = this.jwtHelper.decodeToken(token).sub;
        this.storage.set('profile', sub);
    };
    LoginPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Http,
            Storage,
            LoadingController,
            ToastController,
            Facebook,
            Events,
            GooglePlus,
            MenuController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map