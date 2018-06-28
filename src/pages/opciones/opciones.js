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
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
/**
 * Generated class for the OpcionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OpcionesPage = /** @class */ (function () {
    function OpcionesPage(navCtrl, navParams, menuCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.menuCtrl = menuCtrl;
        this.Notificaciones = "true";
        this.Text = "Desactivar Notificaciones";
        this.estadoPositivo = true;
    }
    OpcionesPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad OpcionesPage');
        this.menuCtrl.close();
    };
    OpcionesPage.prototype.change = function () {
        this.Text = (this.estadoPositivo) ? "Activar Notificaciones" : "Desactivar Notificaciones";
        this.estadoPositivo = !this.estadoPositivo;
    };
    OpcionesPage.prototype.MoveToHome = function () {
        this.navCtrl.pop();
    };
    OpcionesPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-opciones',
            templateUrl: 'opciones.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams, MenuController])
    ], OpcionesPage);
    return OpcionesPage;
}());
export { OpcionesPage };
//# sourceMappingURL=opciones.js.map