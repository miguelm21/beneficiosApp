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
import { Http, Headers } from "@angular/http";
import { LoginPage } from '../login/login';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, navParams, menuCtrl, http, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menuCtrl = menuCtrl;
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
    }
    RegisterPage.prototype.ionViewDidLoad = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="../../assets/spinner2.gif"/>'
        });
        loading.present();
        loading.dismiss();
        console.log('ionViewDidLoad RegisterPage');
        this.menuCtrl.close();
    };
    RegisterPage.prototype.keytab = function (event) {
        var element = event.srcElement.nextElementSibling; // get the sibling element
        if (element == null) // check if its null
            return;
        else
            element.focus(); // focus if not null
    };
    RegisterPage.prototype.login = function () {
        this.navCtrl.push(LoginPage);
    };
    RegisterPage.prototype.register = function () {
        var _this = this;
        if (this.Password == this.Password_confirmation) {
            var loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: '<img src="../../assets/spinner3.gif"/>'
            });
            loading.present();
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('X-Requested-With', 'XMLHttpRequest');
            var credentials = JSON.stringify({ name: this.Name, dni: this.Dni, email: this.Email, phone: this.Phone, province: this.Province, city: this.City, domicile: this.Domicile, password: this.Password });
            this.http.post(this.api + 'register', credentials, { headers: headers })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) { _this.toast('Registro exitoso'); _this.navCtrl.push(LoginPage); loading.dismiss(); }, function (err) {
                loading.dismiss();
                if (err.status == 401) {
                    _this.toast('No se encontro el usuario');
                }
                else if (err.status == 500) {
                    _this.toast('Ocurrio un error');
                }
                else {
                    _this.toast('Ocurrio un error');
                }
            });
        }
        else {
            this.toast('Las contraseñas no coinciden');
        }
    };
    RegisterPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    RegisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-register',
            templateUrl: 'register.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MenuController,
            Http,
            ToastController,
            LoadingController])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map