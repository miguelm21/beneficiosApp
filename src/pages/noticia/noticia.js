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
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the NoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var NoticiaPage = /** @class */ (function () {
    function NoticiaPage(navCtrl, navParams, http, toastCtrl, sanitizer, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.sanitizer = sanitizer;
        this.loadingCtrl = loadingCtrl;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
    }
    NoticiaPage.prototype.ionViewDidLoad = function () {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="../../assets/spinner3.gif"/>'
        });
        loading.present();
        loading.dismiss();
        console.log('ionViewDidLoad NoticiaPage');
    };
    NoticiaPage.prototype.ionViewWillEnter = function () {
        var id = this.navParams.get('id');
        var token = 'Bearer' + this.navParams.get('token');
        this.token = token;
        this.getNew(id, token);
        this.initializeItems();
    };
    NoticiaPage.prototype.initializeItems = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.get('https://clubbeneficiosuno.goodcomex.com/beneficios/public/getBenefits2.json', { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.items = data;
        }, function (err) {
            _this.toast('no se encontraron beneficios');
        });
    };
    NoticiaPage.prototype.getItems = function (ev) {
        // set val to the value of the searchbar
        var val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.showList = true;
            this.items = this.items.filter(function (item) {
                return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        }
        else if (!val || val == undefined) {
            this.showList = false;
        }
    };
    NoticiaPage.prototype.getNew = function (id, token) {
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
        this.http.get(this.api + 'new/' + id, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            var monthNames = [
                "Ene", "Feb", "Mar",
                "Abr", "May", "Jun", "Jul",
                "Ago", "Sep", "Oct",
                "Nov", "Dic"
            ];
            var date = new Date(data.new.date);
            var day = date.getDate();
            var monthIndex = date.getMonth();
            _this.id = data.new.id;
            _this.title = data.new.title;
            _this.text = data.new.text;
            _this.image = _this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + data.new.image);
            _this.day = day;
            _this.month = monthNames[monthIndex];
            _this.user = data.new.user;
            loading.dismiss();
        }, function (err) {
            if (err.status == 401) {
                _this.toast('No se encontro ninguna noticia');
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
    NoticiaPage.prototype.back = function () {
        this.navCtrl.pop();
    };
    NoticiaPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    NoticiaPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-noticia',
            templateUrl: 'noticia.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Http,
            ToastController,
            DomSanitizer,
            LoadingController])
    ], NoticiaPage);
    return NoticiaPage;
}());
export { NoticiaPage };
//# sourceMappingURL=noticia.js.map