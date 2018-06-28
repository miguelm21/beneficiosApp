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
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers } from '@angular/http';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';
/**
 * Generated class for the BeneficioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BeneficioPage = /** @class */ (function () {
    function BeneficioPage(navCtrl, navParams, locationAccuracy, toastCtrl, http, loadingCtrl, sanitizer, geolocation) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.locationAccuracy = locationAccuracy;
        this.toastCtrl = toastCtrl;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.sanitizer = sanitizer;
        this.geolocation = geolocation;
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
    }
    BeneficioPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        var id = this.navParams.get('id');
        var token = 'Bearer' + this.navParams.get('token');
        this.token = token;
        this.locationAccuracy.canRequest().then(function (canRequest) {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                _this.locationAccuracy.request(_this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(function () { return console.log('Request successful'); }, function (error) { return console.log('Error requesting location permissions', error); });
            }
        });
        this.Pos = this.getLocation();
        this.getLocation();
        /*this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');
        console.log(this.latitude);
        console.log(this.longitude);*/
        this.getData(id);
        this.initializeItems();
        setTimeout(function () { _this.getLocation(); _this.getData(id); }, 5000);
    };
    BeneficioPage.prototype.initializeItems = function () {
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
    BeneficioPage.prototype.getItems = function (ev) {
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
    BeneficioPage.prototype.getData = function (id) {
        /*let loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: '<img src="../../assets/spinner3.gif"/>'
        });
        loading.present();*/
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        /*headers.append('Authorization', token);*/
        this.http.get(this.api + 'benefit/' + id, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            var dat = data.benefit;
            var img = _this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + dat.image);
            var a = { id: dat.id, name: dat.name, description: dat.description, image: img, iconmap: dat.iconmap, category: dat.category, latitude: dat.latitude, longitude: dat.longitude };
            /*data.benefit.forEach(function(data) {
              
            }, this);*/
            /*Array.prototype.forEach.call(data, data => {
              console.log(data);
              var img = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + data.image);
              benef.push({ id: data.id, name: data.name, description: data.description, image: img, iconmap: data.iconmap, category: data.category, latitude: data.latitude, longitude: data.longitude });
            });*/
            _this.benefit = a;
            console.log(_this.latitude);
            _this.initMap(_this.benefit, _this.latitude, _this.longitude);
            /*loading.dismiss();*/
        }, function (err) {
            if (err.status == 401) {
                _this.toast('No se encontraron datos');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
            /*loading.dismiss();*/
        });
    };
    BeneficioPage.prototype.getLocation = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            _this.latitude = position.coords.latitude;
            _this.longitude = position.coords.longitude;
            return position.coords;
        }).catch(function (error) {
            console.log('Error getting location');
        });
    };
    BeneficioPage.prototype.initMap = function (benefit, latitude, longitude) {
        var markers = [];
        var Centro = { lat: parseFloat(benefit.latitude), lng: parseFloat(benefit.longitude) };
        var Me = { lat: latitude, lng: longitude };
        console.log(Centro);
        console.log(Me);
        google.maps.event.trigger(map, 'resize');
        var map = new google.maps.Map(document.getElementById('map2'), {
            zoom: 16,
            center: Centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        //InforWindows
        var contentString = '<div class="container">' +
            /*'<img class="card-img-top" height="30px" src="data:image/png;base64,' + benefit.image +'" alt="map-image' + benefit.id + '">' +*/
            '<div class="card-body">' +
            '<h5 class="box-panel-closest__title">' + benefit.name + '</h5>' +
            '<p class="box-panel-closest__text">' + benefit.description + '</p>' +
            '<a href="' + benefit.id + '" class="btn button-style pull-right">Ver más</a>' +
            '</div>' +
            '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        //Markers
        var marker = new google.maps.Marker({
            position: Centro,
            map: map,
            icon: benefit.iconmap,
            title: benefit.name
        });
        markers.push(marker);
        var marker = new google.maps.Marker({
            position: Me,
            map: map,
        });
        markers.push(marker);
        var line = new google.maps.Polyline({
            path: [new google.maps.LatLng(latitude, longitude), new google.maps.LatLng(benefit.latitude, benefit.longitude)],
            strokeColor: "#133F",
            strokeOpacity: 1.0,
            strokeWeight: 5,
            geodesic: true,
            map: map
        });
        this.setMapOnAll(map, markers);
    };
    BeneficioPage.prototype.setMapOnAll = function (map, markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    };
    BeneficioPage.prototype.clearMarkers = function () {
        this.setMapOnAll(null, null);
    };
    BeneficioPage.prototype.deleteMarkers = function (markers) {
        this.clearMarkers();
        markers = [];
    };
    BeneficioPage.prototype.back = function () {
        this.navCtrl.pop();
    };
    BeneficioPage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    BeneficioPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-beneficio',
            templateUrl: 'beneficio.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LocationAccuracy,
            ToastController,
            Http,
            LoadingController,
            DomSanitizer,
            Geolocation])
    ], BeneficioPage);
    return BeneficioPage;
}());
export { BeneficioPage };
//# sourceMappingURL=beneficio.js.map