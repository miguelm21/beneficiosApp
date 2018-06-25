import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, MenuController, ToastController, AlertController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Http, Headers } from '@angular/http';
import { Slides, LoadingController} from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import 'rxjs/add/operator/map'

import { CategoryPage } from '../category/category';
import { NoticiaPage } from '../noticia/noticia';
import { BeneficioPage } from '../beneficio/beneficio';

declare var google;
declare var map;

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
     selector: 'page-home',
     templateUrl: 'home.html',
 })
 export class HomePage {
     information: any[];
     parameter1: any;
     status: any = this.parameter1;
     section: string;
     somethings: any = new Array(20);
     _imageViewerCtrl: ImageViewerController;
     @ViewChild(Slides) slides: Slides;
     latitude;
     longitude;

     api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';
     onesignalId
     token;
     Checkbox: any[] = [];
     Km;
     Pos;
     show;

     items;
     items2;
     showList = false;

     categories: Object[];
     benefs: Array<any>;
     benefits: Object[];
     news: Array<any>;
     news2: any[] = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private http: Http,
        public imageViewerCtrl: ImageViewerController,
        public loadingCtrl: LoadingController,
        public menuCtrl: MenuController,
        private locationAccuracy: LocationAccuracy,
        private alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private platform: Platform,
        private oneSignal: OneSignal,
        public geolocation: Geolocation) {
            platform.ready().then(() => {    
                this.platform.pause.subscribe(() => {
                    console.log('[INFO] App paused');
                    
                });

                this.platform.resume.subscribe(() => {
                    console.log('[INFO] App resumed');
                });
                var notificationOpenedCallback = function(jsonData) {
                     this.benefit(jsonData.notification.payload.additionalData.id)
                };
                
                window["plugins"].OneSignal
                  .startInit("4348c8d3-0923-4a76-841d-98de77f2c29e", "4493616060")
                  .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.Notification)
                  .handleNotificationOpened(notificationOpenedCallback)
                  .endInit();
                window["plugins"].OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
                  //alert("User accepted notifications: " + accepted);
                  
                });  
                this.oneSignal.getIds().then((ids)=>{
                   
                    this.onesignalId = ids.userId;
                })
              });
            

            let localData = http.get('assets/information.json').map(res => res.json().items);
                localData.subscribe(data => {
                this.information = data;
            });
            this._imageViewerCtrl = imageViewerCtrl; 
            this.parameter1 = navParams.get('param1'); 
            this.parameter1 = this.navParams.get('param1');
           
            if(this.parameter1)
            {
                this.section = this.parameter1;
            }
            else
            {
                this.section = '1';
            }   
    }

    ionViewWillEnter() {
       this.locationAccuracy.canRequest().then((canRequest: boolean) => {
             if(canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => console.log('Request successful'),
              error => console.log('Error requesting location permissions', error)
              );
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

        setInterval(() => { this.getLocation(); this.getMapData(); }, 15000);
    }
     
    ionViewDidLoad() {
        this.menuCtrl.close();
        console.log("cargo")
        
     }

     initializeItems() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        this.http.get('https://clubbeneficiosuno.goodcomex.com/beneficios/public/getBenefits2.json', { headers: headers })
        .map(res => res.json())
          .subscribe(
            data => {
                console.log(data);
                this.items = data;
                console.log(this.items);
            },
            err => {
                this.toast('no se encontraron beneficios')
            }
          );

          this.items2 = ['Amsterdam', 'Bogota', 'Caracas'];
      }

    getItems(ev: any) {

        // set val to the value of the searchbar
        let val = ev.target.value;
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
          this.showList = true;
          this.items = this.items.filter((item) => {
            return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
        else if(!val || val == undefined) {
            this.showList = false;
        }
    }

    hiddenList(ev: any) {
        this.showList = false;
    }

    toggleSection(i) {
      this.information[i].open = !this.information[i].open;
    }
 
    toggleItem(i, j) {
      this.information[i].children[j].open = !this.information[i].children[j].open;
    };

    getMapData() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        this.http.get(this.api + 'map', { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { 
                this.categories = data.categories;
                this.benefs = data.benefs;
                this.benefits = data.benefits;
                this.news = data.news;

                var n = [];
                this.news.forEach((data) => {
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

                    this.news2.push({ id: data.id, title: data.title, text: data.text, image: data.image, mime: data.mime, size: data.size, user: data.user, day: day, month: monthNames[monthIndex] })
                });

                this.initMap(this.benefs,this.latitude, this.longitude); },
            err => {
              if (err.status == 401){
                this.toast('No se encontraron datos');
              } else if (err.status == 500) {
                this.toast('Ocurrio un error');
              } else {
                this.toast('Ocurrio un error');
              }
            },
          );
    }

    getLocation() {
        this.geolocation.getCurrentPosition().then((position) => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;   
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('X-Requested-With', 'XMLHttpRequest');
            headers.append('Authorization', this.token);
            this.http.get(this.api + 'sendMessagePosition/'+ this.latitude +'/'+ this.longitude +'/' + this.onesignalId, { headers: headers })         
            return position.coords;
        }).catch((error) => {
          console.log('Error getting location');
      });
    }
  
    initMap(benefits, latitude, longitude) {
        let markers = [];
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

        if(Object.keys(benefits).length <= 0) {
            this.show = 0;
        }
        else if (Object.keys(benefits).length >= 1) {
            this.show = 1;
        }

        benefits.forEach(data => {
            var contentString = 
            '<div class="container">' +
                '<img class="card-img-top" height="30px" src="data:image/png;base64,' + data.image +'" alt="map-image' + data.id + '">' +
                '<div class="card-body">' +
                  '<h5 class="box-panel-closest__title">' + data.name  +'</h5>' +
                  '<p class="box-panel-closest__text">' + data.description +'</p>' +
                '<a href="' + data.id +'" class="btn button-style pull-right">Ver más</a>' +
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
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
            markers.push(marker);
        });
;
        this.setMapOnAll(map, markers);
    }

    filterCategoryMap(id, e) {
        var benef = [];
        if(e.checked)
        {
            this.Checkbox.push(id);
        }
        else
        {
            var index = this.Checkbox.indexOf(id);
            this.Checkbox.splice(index, 1);
        }

        if(typeof this.Checkbox !== 'undefined' && this.Checkbox.length > 0)
        {
            if(this.Km) {
                var ben = [];

                benef.forEach((data) => {
                    var distance = this.calculateDistance(this.latitude, this.longitude, data.latitude, data.longitude);
                    if(this.Km < 1) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                        this.Km = 1;
                    }

                    if(distance <= this.Km) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                    }
                });
                if(this.Km < 1) {
                    this.initMap(ben, this.latitude, this.longitude);
                    this.benefits = ben;
                }
                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
            else {
                var ben = []
                benef.push(this.benefs.filter(item => this.Checkbox.some(f => f == item.category_id)))

                var key = benef.shift();
                this.initMap(key, this.latitude, this.longitude);
                this.benefits = key;
            }
        }
        else
        {
            this.initMap(this.benefs, this.latitude, this.longitude);
            this.benefits = this.benefs;
            console.log(this.benefs);
        }
    }

    filterKmMap(latitude, longitude) {
        if(typeof this.Checkbox !== 'undefined' && this.Checkbox.length > 0)
        {
            var benef = [];
            benef.push(this.benefs.filter(item => this.Checkbox.some(f => f == item.category_id)))

            if(this.Km) {
                var ben = [];
                var key = benef.shift();

                key.forEach((data) => {
                    var distance = this.calculateDistance(this.latitude, this.longitude, data.latitude, data.longitude);
                    if(this.Km < 1) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                        this.Km = 1;
                    }

                    if(distance <= this.Km) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                    }
                });
                if(this.Km < 1) {
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

                keys.forEach((data) => {
                    ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                });
                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
        }
        else
        {
            if(this.Km)
            {
                var ben = [];

                this.benefs.forEach((data) => {
                    var distance = this.calculateDistance(this.latitude, this.longitude, data['latitude'], data['longitude']);
                    if(this.Km < 1) {
                        this.Km = 1;
                        this.initMap(this.benefs, this.latitude, this.longitude);
                    }

                    if(distance <= this.Km) {
                        ben.push({ id: data.id, name: data.name, description: data.description, iconmap: data.iconmap, latitude: data.latitude, longitude: data.longitude, image: data.image });
                    }
                });

                this.initMap(ben, this.latitude, this.longitude);
                this.benefits = ben;
            }
            else
            {
                this.initMap(this.benefs, this.latitude, this.longitude);
                this.benefits = this.benefs
            }
        }
    }

    setMapOnAll(map, markers) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
    }

    clearMarkers() {
        this.setMapOnAll(null, null);
    }

    deleteMarkers(markers) {
        this.clearMarkers();
        markers = [];
    }

    calculateDistance(lat1, long1, lat2, long2) {
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
    }

    PostBenefit(id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        var credentials = JSON.stringify({ id: id });
        this.http.post(this.api + 'postbenefit/', credentials, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { this.toast('Beneficio Guardado'); this.getMapData() },
            err => {
              if (err.status == 401){
                this.toast('Error al guardar el Beneficio');
              } else if (err.status == 500) {
                this.toast('Ocurrio un error');
              } else {
                this.toast('Ocurrio un error');
              }
            },
          );
    }

    UnpostBenefit(id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        this.http.delete(this.api + 'unpostbenefit/' + id, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { this.toast('Beneficio Borrado'); this.getMapData() },
            err => {
              if (err.status == 401){
                this.toast('Error al borrar el Beneficio');
              } else if (err.status == 500) {
                this.toast('Ocurrio un error');
              } else {
                this.toast('Ocurrio un error');
              }
            },
          );
    }

    SendData() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        /*var credentials = JSON.stringify({ data: this.benefs });*/
        this.http.post(this.api + 'registerPush', {}, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { console.log(data.response); },
            err => {
              if (err.status == 401){
                this.toast('Error al enviar informacion');
              } else if (err.status == 500) {
                this.toast('Ocurrio un error');
              } else {
                this.toast('Ocurrio un error');
              }
            },
          );
    }

    SendMessage() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        /*var credentials = JSON.stringify({ data: this.benefs });*/
        this.http.post(this.api + 'sendMessage', {}, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { console.log(data.allresponses.id) },
            err => {
              if (err.status == 401){
                this.toast('Error al enviar informacion');
              } else if (err.status == 500) {
                this.toast('Ocurrio un error');
              } else {
                this.toast('Ocurrio un error');
              }
            },
          );
    }

    category(id) {
        this.navCtrl.push(CategoryPage, { id: id, token: this.token });
    }

    article(id){
        this.navCtrl.push(NoticiaPage, { id: id, token: this.token });
    }

    benefit(id){
        this.navCtrl.push(BeneficioPage, {id: id, token: this.token });
    }

    presentImage(myImage) {
        const imageViewer = this._imageViewerCtrl.create(myImage);
        imageViewer.present();
    }

    toast(message) {
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: 'bottom'
        });

        toast.present();
    }

    pushNotification() {
        this.oneSignal.startInit('876b6875-5142-4bb5-a1b5-7b585341e078', '146169855521');
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
        this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
        this.oneSignal.endInit();
    }

    private onPushReceived(payload: OSNotificationPayload) {
        alert('Push recevied:' + payload.body);
    }

    private onPushOpened(payload: OSNotificationPayload) {
        alert('Push opened: ' + payload.body);
    }
    handlerNotifications(){
      this.oneSignal.startInit('b2f7f966-d8cc-11e4-bed1-df8f05be55ba', '703322744261');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationOpened()
      .subscribe(jsonData => {
        let alert = this.alertCtrl.create({
          title: jsonData.notification.payload.title,
          subTitle: jsonData.notification.payload.body,
          buttons: ['OK']
        });
        alert.present();
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      });
      this.oneSignal.endInit();
    }
}
