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
var PasswordPage = /** @class */ (function () {
    function PasswordPage(navCtrl, navParams, loadingCtrl, toastCtrl, http, storage, menuCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.storage = storage;
        this.menuCtrl = menuCtrl;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
    }
    PasswordPage.prototype.ionViewDidLoad = function () {
        this.menuCtrl.close();
    };
    PasswordPage.prototype.ionViewWillEnter = function () {
        this.token = 'Beaer' + this.navParams.get('token');
        this.profile = this.navParams.get('profile');
        console.log(this.profile);
    };
    PasswordPage.prototype.UpdatePassword = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="../../assets/spinner3.gif"/>'
        });
        loading.present();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        var credentials = JSON.stringify({ old_password: this.Oldpassword, password: this.Password, password_confirmation: this.PasswordConfirmation });
        this.http.put(this.api + 'updatepassword/' + this.profile.id, credentials, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { loading.dismiss(); _this.toast('Contraseña actualizada con exito'); _this.logout(); }, function (err) {
            loading.dismiss();
            if (err.status == 401) {
                _this.toast('Contraseña Actual Incorrecta');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    PasswordPage.prototype.logout = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="../../assets/spinner3.gif"/>'
        });
        loading.present();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.post(this.api + 'logout', {}, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.navCtrl.setRoot(LoginPage); _this.storage.remove('token'); _this.storage.remove('profile'); loading.dismiss(); }, function (err) {
            if (err.status == 401) {
                _this.storage.remove('token');
                _this.storage.remove('profile');
                _this.navCtrl.push(LoginPage);
            }
            else if (err.status == 400) {
                _this.toast('Su usuario ha sido deshabilitado');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
            loading.dismiss();
        });
    };
    PasswordPage.prototype.back = function () {
        this.navCtrl.popToRoot();
    };
    PasswordPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    PasswordPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-password',
            templateUrl: 'password.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            ToastController,
            Http,
            Storage,
            MenuController])
    ], PasswordPage);
    return PasswordPage;
}());
export { PasswordPage };
//# sourceMappingURL=password.js.map