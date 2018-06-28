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
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
/**
 * Generated class for the EditperfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var EditperfilPage = /** @class */ (function () {
    function EditperfilPage(navCtrl, navParams, toastCtrl, http, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
    }
    EditperfilPage.prototype.ionViewWillEnter = function () {
        this.token = this.navParams.get('token');
        this.profile = this.navParams.get('profile');
        this.Name = this.profile.name;
        this.Dni = this.profile.dni;
        this.Phone = this.profile.phone;
        this.Province = this.profile.province;
        this.City = this.profile.city;
        this.Domicile = this.profile.domicile;
    };
    EditperfilPage.prototype.UpdateProfile = function () {
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
        var credentials = JSON.stringify({ name: this.Name, dni: this.Dni, phone: this.Phone, province: this.Province, city: this.City, domicile: this.Domicile });
        this.http.put(this.api + 'updateprofile/' + this.profile.id, credentials, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { loading.dismiss(); _this.toast('Perfil actualizado con exito'); }, function (err) {
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
    EditperfilPage.prototype.back = function () {
        this.navCtrl.popToRoot();
    };
    EditperfilPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    EditperfilPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-editperfil',
            templateUrl: 'editperfil.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ToastController,
            Http,
            LoadingController])
    ], EditperfilPage);
    return EditperfilPage;
}());
export { EditperfilPage };
//# sourceMappingURL=editperfil.js.map