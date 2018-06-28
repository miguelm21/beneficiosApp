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
import { ImageViewerController } from 'ionic-img-viewer';
import { Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";
import { LoginPage } from '../login/login';
import { EditperfilPage } from '../editperfil/editperfil';
import { PasswordPage } from '../password/password';
/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var PerfilPage = /** @class */ (function () {
    function PerfilPage(navCtrl, navParams, menuCtrl, imageViewerCtrl, storage, toastCtrl, http, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menuCtrl = menuCtrl;
        this.storage = storage;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
        this._imageViewerCtrl = imageViewerCtrl;
    }
    PerfilPage.prototype.ionViewDidLoad = function () {
        this.menuCtrl.close();
    };
    PerfilPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.storage.get('token').then(function (data) {
            if (data != null) {
                if (data == 'token_expired') {
                    _this.navCtrl.setRoot(LoginPage);
                }
                else if (data == undefined) {
                    _this.navCtrl.setRoot(LoginPage);
                }
                else if (data == 'Unauthenticated.') {
                    _this.navCtrl.setRoot(LoginPage);
                }
                else {
                    _this.token = 'Bearer' + data;
                    var token = 'Bearer' + data;
                    _this.getProfile(token);
                }
            }
        });
    };
    PerfilPage.prototype.getProfile = function (token) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="../../assets/spinner3.gif"/>'
        });
        loading.present();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', token);
        this.http.get(this.api + 'me/', { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.profile = data;
            loading.dismiss();
        }, function (err) {
            loading.dismiss();
            if (err.status == 401) {
                _this.toast('No se encontraron datos');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    PerfilPage.prototype.presentImage = function (myImage) {
        var imageViewer = this._imageViewerCtrl.create(myImage);
        imageViewer.present();
    };
    PerfilPage.prototype.home = function () {
        this.navCtrl.popToRoot();
    };
    PerfilPage.prototype.EditProfile = function () {
        this.navCtrl.push(EditperfilPage, { profile: this.profile, token: this.token });
    };
    PerfilPage.prototype.ChangePassword = function () {
        this.navCtrl.push(PasswordPage, { profile: this.profile, token: this.token });
    };
    PerfilPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    PerfilPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-perfil',
            templateUrl: 'perfil.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            MenuController,
            ImageViewerController,
            Storage,
            ToastController,
            Http,
            LoadingController])
    ], PerfilPage);
    return PerfilPage;
}());
export { PerfilPage };
//# sourceMappingURL=perfil.js.map