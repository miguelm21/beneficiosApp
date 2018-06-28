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
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { BeneficioPage } from '../beneficio/beneficio';
/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CategoryPage = /** @class */ (function () {
    function CategoryPage(navCtrl, navParams, http, toastCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
    }
    CategoryPage.prototype.ionViewDidLoad = function () {
    };
    CategoryPage.prototype.ionViewWillEnter = function () {
        var id = this.navParams.get('id');
        var token = this.navParams.get('token');
        this.id = this.navParams.get('id');
        this.token = this.navParams.get('token');
        this.getCategory(id, token);
        this.initializeItems();
    };
    CategoryPage.prototype.initializeItems = function () {
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
    CategoryPage.prototype.getItems = function (ev) {
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
    CategoryPage.prototype.getCategory = function (id, token) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: '<img src="assets/spinner3.gif"/>'
        });
        loading.present();
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', token);
        this.http.get(this.api + 'category/' + id, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.category = data.category;
            _this.categories = data.categories;
            _this.benefits = data.benefits;
            _this.section = id;
            _this.filterBenefits(id);
            loading.dismiss();
        }, function (err) {
            if (err.status == 401) {
                _this.toast('No se encontro ninguna categoria');
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
    CategoryPage.prototype.PostBenefit = function (id) {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        var credentials = JSON.stringify({ id: id });
        this.http.post('http://127.0.0.1:8000/api/postbenefit/', credentials, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.toast('Beneficio Guardado'); _this.getCategory(_this.id, _this.token); }, function (err) {
            if (err.status == 401) {
                _this.toast('Error al guardar el Beneficio');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    CategoryPage.prototype.UnpostBenefit = function (id) {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.delete('http://127.0.0.1:8000/api/unpostbenefit/' + id, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.toast('Beneficio Borrado'); _this.getCategory(_this.id, _this.token); }, function (err) {
            if (err.status == 401) {
                _this.toast('Error al borrar el Beneficio');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    CategoryPage.prototype.filterBenefits = function (id) {
        this.benefs = this.benefits.filter(function (benefit) { return benefit.category_id === id; });
        this.section = id;
    };
    CategoryPage.prototype.home = function () {
        this.navCtrl.pop();
    };
    CategoryPage.prototype.benefit = function (id) {
        this.navCtrl.push(BeneficioPage, { id: id, token: this.token });
    };
    CategoryPage.prototype.presentImage = function (myImage) {
        var imageViewer = this._imageViewerCtrl.create(myImage);
        imageViewer.present();
    };
    CategoryPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    __decorate([
        ViewChild('myElement'),
        __metadata("design:type", Object)
    ], CategoryPage.prototype, "myElem", void 0);
    CategoryPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-category',
            templateUrl: 'category.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Http,
            ToastController,
            LoadingController])
    ], CategoryPage);
    return CategoryPage;
}());
export { CategoryPage };
//# sourceMappingURL=category.js.map