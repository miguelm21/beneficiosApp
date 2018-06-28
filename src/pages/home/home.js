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
import { IonicPage, Platform, NavController, NavParams, MenuController, ToastController, AlertController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Http, Headers } from '@angular/http';
import { Slides, LoadingController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import 'rxjs/add/operator/map';
import { CategoryPage } from '../category/category';
import { NoticiaPage } from '../noticia/noticia';
import { BeneficioPage } from '../beneficio/beneficio';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, navParams, http, imageViewerCtrl, loadingCtrl, menuCtrl, locationAccuracy, alertCtrl, toastCtrl, platform, oneSignal, geolocation) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.imageViewerCtrl = imageViewerCtrl;
        this.loadingCtrl = loadingCtrl;
        this.menuCtrl = menuCtrl;
        this.locationAccuracy = locationAccuracy;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.oneSignal = oneSignal;
        this.geolocation = geolocation;
        this.status = this.parameter1;
        this.somethings = new Array(20);
        this.api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
        this.Checkbox = [];
        this.showList = false;
        this.news2 = [];
        platform.ready().then(function () {
            _this.platform.pause.subscribe(function () {
                console.log('[INFO] App paused');
            });
            _this.platform.resume.subscribe(function () {
                console.log('[INFO] App resumed');
            });
            var notificationOpenedCallback = function (jsonData) {
                this.benefit(jsonData.notification.payload.additionalData.id);
            };
            window["plugins"].OneSignal
                .startInit("fe180572-6b5a-4d0f-82fc-aa1db3ad58a6", "658919823391")
                .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
                .handleNotificationOpened(notificationOpenedCallback)
                .endInit();
            window["plugins"].OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
                //alert("User accepted notifications: " + accepted);
            });
            _this.oneSignal.getIds().then(function (ids) {
                _this.onesignalId = ids.userId;
            });
        });
        var localData = http.get('assets/information.json').map(function (res) { return res.json().items; });
        localData.subscribe(function (data) {
            _this.information = data;
        });
        this._imageViewerCtrl = imageViewerCtrl;
        this.parameter1 = navParams.get('param1');
        this.parameter1 = this.navParams.get('param1');
        if (this.parameter1) {
            this.section = this.parameter1;
        }
        else {
            this.section = '2';
        }
    }
    HomePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.locationAccuracy.canRequest().then(function (canRequest) {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                _this.locationAccuracy.request(_this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(function () { return console.log('Request successful'); }, function (error) { return console.log('Error requesting location permissions', error); });
            }
        });
        this.token = 'Bearer' + this.navParams.get('token');
        this.Pos = this.getLocation();
        this.getLocation();
        this.getMapData();
        /*this.handlerNotifications();*/
        this.SendData();
        // Reset items back to all of the 
        this.initializeItems();
        /*this.SendMessage();*/
        setInterval(function () { _this.getLocation(); _this.getMapData(); }, 15000);
    };
    HomePage.prototype.ionViewDidLoad = function () {
        this.menuCtrl.close();
    };
    HomePage.prototype.initializeItems = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.get('https://clubbeneficiosuno.goodcomex.com/beneficios/public/getBenefits2.json', { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            _this.items = data;
            console.log(_this.items);
        }, function (err) {
            _this.toast('no se encontraron beneficios');
        });
        this.items2 = ['Amsterdam', 'Bogota', 'Caracas'];
    };
    HomePage.prototype.getItems = function (ev) {
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
    HomePage.prototype.hiddenList = function (ev) {
        this.showList = false;
    };
    HomePage.prototype.toggleSection = function (i) {
        this.information[i].open = !this.information[i].open;
    };
    HomePage.prototype.toggleItem = function (i, j) {
        this.information[i].children[j].open = !this.information[i].children[j].open;
    };
    ;
    HomePage.prototype.getMapData = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.get(this.api + 'map', { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.categories = data.categories;
            _this.benefs = data.benefs;
            _this.benefits = data.benefs;
            _this.news = data.news;
            console.log(_this.benefits);
            var n = [];
            _this.news.forEach(function (data) {
                var monthNames = [
                    "Ene", "Feb", "Mar",
                    "Abr", "May", "Jun", "Jul",
                    "Ago", "Sep", "Oct",
                    "Nov", "Dic"
                ];
                var date = new Date(data.date);
                var day = date.getDate();
                var monthIndex = date.getMonth();
                var year = date.getFullYear();
                var date2 = day + ' ' + monthNames[monthIndex];
                _this.news2.push({ id: data.id, title: data.title, text: data.text, image: data.image, mime: data.mime, size: data.size, user: data.user, day: day, month: monthNames[monthIndex] });
            });
            _this.initMap(_this.benefs, _this.latitude, _this.longitude);
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
        });
    };
    HomePage.prototype.getLocation = function () {
        var _this = this;
        alert("alert desde afuera" + this.latitude + this.longitude);
        this.geolocation.getCurrentPosition().then(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            _this.latitude = position.coords.latitude;
            _this.longitude = position.coords.longitude;
            _this.sendNotification(_this.latitude, _this.longitude, _this.onesignalId);
            return position.coords;
        }).catch(function (error) {
            console.log('Error getting location');
        });
    };
    HomePage.prototype.sendNotification = function (latitude, longitude, id) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.get(this.api + 'sendMessagePosition/' + latitude + '/' + longitude + '/' + id, { headers: headers });
    };
    HomePage.prototype.initMap = function (benefits, latitude, longitude) {
        var markers = [];
        var Centro = { lat: latitude, lng: longitude };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: Centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var marker = new google.maps.Marker({
            position: Centro,
            map: map
        });
        markers.push(marker);
        if (Object.keys(benefits).length <= 0) {
            this.show = 0;
        }
        else if (Object.keys(benefits).length >= 1) {
            this.show = 1;
        }
        benefits.forEach(function (data) {
            var contentString = '<div class="container">' +
                '<img class="card-img-top" height="30px" src="data:image/png;base64,' + data.image + '" alt="map-image' + data.id + '">' +
                '<div class="card-body">' +
                '<h5 class="box-panel-closest__title">' + data.name + '</h5>' +
                '<p class="box-panel-closest__text">' + data.description + '</p>' +
                '<a href="' + data.id + '" class="btn button-style pull-right">Ver más</a>' +
                '</div>' +
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            var marker = new google.maps.Marker({
                position: { lat: data.latitude, lng: data.longitude },
                map: map,
                icon: data.iconmap,
                title: data.name
            });
            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
            markers.push(marker);
        });
        ;
        this.setMapOnAll(map, markers);
    };
    HomePage.prototype.filterCategoryMap = function (id, e) {
        var _this = this;
        var benef = [];
        if (e.checked) {
            this.Checkbox.push(id);
        }
        else {
            var index = this.Checkbox.indexOf(id);
            this.Checkbox.splice(index, 1);
        }
        if (typeof this.Checkbox !== 'undefined' && this.Checkbox.length > 0) {
            if (this.Km) {
                var ben = [];
                benef.forEach(function (data) {
                    var distance = _this.calculateDistance(_this.latitude, _this.longitude, data.latitude, data.longitude);
                    if (_this.Km < 1) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                        _this.Km = 1;
                    }
                    if (distance <= _this.Km) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                    }
                });
                if (this.Km < 1) {
                    this.initMap(ben, this.latitude, this.longitude);
                    this.benefits = ben;
                }
                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
            else {
                var ben = [];
                benef.push(this.benefs.filter(function (item) { return _this.Checkbox.some(function (f) { return f == item.category_id; }); }));
                var key = benef.shift();
                this.initMap(key, this.latitude, this.longitude);
                this.benefits = key;
            }
        }
        else {
            this.initMap(this.benefs, this.latitude, this.longitude);
            this.benefits = this.benefs;
            console.log(this.benefs);
        }
    };
    HomePage.prototype.filterKmMap = function (latitude, longitude) {
        var _this = this;
        if (typeof this.Checkbox !== 'undefined' && this.Checkbox.length > 0) {
            var benef = [];
            benef.push(this.benefs.filter(function (item) { return _this.Checkbox.some(function (f) { return f == item.category_id; }); }));
            if (this.Km) {
                var ben = [];
                var key = benef.shift();
                key.forEach(function (data) {
                    var distance = _this.calculateDistance(_this.latitude, _this.longitude, data.latitude, data.longitude);
                    if (_this.Km < 1) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                        _this.Km = 1;
                    }
                    if (distance <= _this.Km) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                    }
                });
                if (this.Km < 1) {
                    this.initMap(key, this.latitude, this.longitude);
                    this.benefits = key;
                }
                console.log(ben);
                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
            else {
                var keys = benef.shift();
                var ben = [];
                keys.forEach(function (data) {
                    ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                });
                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
        }
        else {
            if (this.Km) {
                var ben = [];
                this.benefs.forEach(function (data) {
                    var distance = _this.calculateDistance(_this.latitude, _this.longitude, data['latitude'], data['longitude']);
                    if (_this.Km < 1) {
                        _this.Km = 1;
                        _this.initMap(_this.benefs, _this.latitude, _this.longitude);
                    }
                    if (distance <= _this.Km) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                    }
                });
                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
            else {
                this.initMap(this.benefs, this.latitude, this.longitude);
                this.benefits = this.benefs;
            }
        }
    };
    HomePage.prototype.setMapOnAll = function (map, markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    };
    HomePage.prototype.clearMarkers = function () {
        this.setMapOnAll(null, null);
    };
    HomePage.prototype.deleteMarkers = function (markers) {
        this.clearMarkers();
        markers = [];
    };
    HomePage.prototype.calculateDistance = function (lat1, long1, lat2, long2) {
        var km = 111.302;
        //1 Grado = 0.01745329 Radianes    
        var degtorad = 0.01745329;
        //1 Radian = 57.29577951 Grados
        var radtodeg = 57.29577951;
        //La formula que calcula la distancia en grados en una esfera, llamada formula de Harvestine. Para mas informacion hay que mirar en Wikipedia
        //http://es.wikipedia.org/wiki/F%C3%B3rmula_del_Haversine
        var dlong = (long1 - long2);
        var dvalue = (Math.sin(lat1 * degtorad) * Math.sin(lat2 * degtorad)) + (Math.cos(lat1 * degtorad) * Math.cos(lat2 * degtorad) * Math.cos(dlong * degtorad));
        var dd = Math.acos(dvalue) * radtodeg;
        return Math.round((dd * km));
    };
    HomePage.prototype.PostBenefit = function (id) {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        var credentials = JSON.stringify({ id: id });
        this.http.post(this.api + 'postbenefit/', credentials, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.toast('Beneficio Guardado'); _this.getMapData(); }, function (err) {
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
    HomePage.prototype.UnpostBenefit = function (id) {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        this.http.delete(this.api + 'unpostbenefit/' + id, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { _this.toast('Beneficio Borrado'); _this.getMapData(); }, function (err) {
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
    HomePage.prototype.SendData = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        /*var credentials = JSON.stringify({ data: this.benefs });*/
        this.http.post(this.api + 'registerPush', {}, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { console.log(data.response); }, function (err) {
            if (err.status == 401) {
                _this.toast('Error al enviar informacion');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    HomePage.prototype.SendMessage = function () {
        var _this = this;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);
        /*var credentials = JSON.stringify({ data: this.benefs });*/
        this.http.post(this.api + 'sendMessage', {}, { headers: headers })
            .map(function (res) { return res.json(); })
            .subscribe(function (data) { console.log(data.allresponses.id); }, function (err) {
            if (err.status == 401) {
                _this.toast('Error al enviar informacion');
            }
            else if (err.status == 500) {
                _this.toast('Ocurrio un error');
            }
            else {
                _this.toast('Ocurrio un error');
            }
        });
    };
    HomePage.prototype.category = function (id) {
        this.navCtrl.push(CategoryPage, { id: id, token: this.token });
    };
    HomePage.prototype.article = function (id) {
        this.navCtrl.push(NoticiaPage, { id: id, token: this.token });
    };
    HomePage.prototype.benefit = function (id, latitude, longitude) {
        this.navCtrl.push(BeneficioPage, { id: id, token: this.token, latitude: latitude, longitude: longitude });
    };
    HomePage.prototype.presentImage = function (myImage) {
        var imageViewer = this._imageViewerCtrl.create(myImage);
        imageViewer.present();
    };
    HomePage.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    HomePage.prototype.pushNotification = function () {
        var _this = this;
        this.oneSignal.startInit('876b6875-5142-4bb5-a1b5-7b585341e078', '146169855521');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(function (data) { return _this.onPushReceived(data.payload); });
        this.oneSignal.handleNotificationOpened().subscribe(function (data) { return _this.onPushOpened(data.notification.payload); });
        this.oneSignal.endInit();
    };
    HomePage.prototype.onPushReceived = function (payload) {
        alert('Push recevied:' + payload.body);
    };
    HomePage.prototype.onPushOpened = function (payload) {
        alert('Push opened: ' + payload.body);
    };
    HomePage.prototype.handlerNotifications = function () {
        var _this = this;
        this.oneSignal.startInit('b2f7f966-d8cc-11e4-bed1-df8f05be55ba', '703322744261');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationOpened()
            .subscribe(function (jsonData) {
            var alert = _this.alertCtrl.create({
                title: jsonData.notification.payload.title,
                subTitle: jsonData.notification.payload.body,
                buttons: ['OK']
            });
            alert.present();
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        });
        this.oneSignal.endInit();
    };
    __decorate([
        ViewChild(Slides),
        __metadata("design:type", Slides)
    ], HomePage.prototype, "slides", void 0);
    HomePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-home',
            templateUrl: 'home.html',
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Http,
            ImageViewerController,
            LoadingController,
            MenuController,
            LocationAccuracy,
            AlertController,
            ToastController,
            Platform,
            OneSignal,
            Geolocation])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map