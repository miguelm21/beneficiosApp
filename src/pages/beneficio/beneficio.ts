import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http, Headers } from '@angular/http';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { DomSanitizer} from '@angular/platform-browser';
import 'rxjs/add/operator/map';

declare var google;
declare var map;

/**
 * Generated class for the BeneficioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-beneficio',
  templateUrl: 'beneficio.html',
})
export class BeneficioPage {
	latitude;
	longitude;

  benefit;
  id;
  name;
  description;
  image;
  iconmap;
  category;
  Pos;
  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  items;
  showList;
  token;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private locationAccuracy: LocationAccuracy,
    public toastCtrl: ToastController,
    private http: Http,
    public loadingCtrl: LoadingController,
    public sanitizer: DomSanitizer,
    public geolocation: Geolocation) {
  }

  ionViewWillEnter() {
    var id = this.navParams.get('id');
    var token = 'Bearer' + this.navParams.get('token');
    this.token = token;

    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
          );
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

    setTimeout(() => { this.getLocation(); this.getData(id); }, 5000);

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
                this.items = data;
            },
            err => {
                this.toast('no se encontraron beneficios')
            }
          );
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

  getData(id) {
    /*let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>'
    });
    loading.present();*/

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    /*headers.append('Authorization', token);*/

    this.http.get(this.api + 'benefit/' + id, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => {

          var dat = data.benefit
          var img = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + dat.image);
           var a = { id: dat.id, name: dat.name, description: dat.description, image: img, iconmap: dat.iconmap, category: dat.category, latitude: dat.latitude, longitude: dat.longitude };

          /*data.benefit.forEach(function(data) {
            
          }, this);*/
          /*Array.prototype.forEach.call(data, data => {
            console.log(data);
            var img = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + data.image);
            benef.push({ id: data.id, name: data.name, description: data.description, image: img, iconmap: data.iconmap, category: data.category, latitude: data.latitude, longitude: data.longitude });
          });*/

          this.benefit = a;
          console.log(this.latitude);

          this.initMap(this.benefit, this.latitude, this.longitude);
          /*loading.dismiss();*/
        },
        err => {
          if (err.status == 401){
            this.toast('No se encontraron datos');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
          /*loading.dismiss();*/
        },
      );
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;            
      return position.coords;
    }).catch((error) => {
      console.log('Error getting location');
    });
  }

  initMap(benefit, latitude, longitude) {
    let markers = [];
    var Centro = { lat: parseFloat(benefit.latitude), lng: parseFloat(benefit.longitude) };
    var Me = { lat: latitude, lng: longitude };

    console.log(Centro);
    console.log(Me);

    var map = new google.maps.Map(document.getElementById('map2'), {
        zoom: 16,
        center: Centro,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //InforWindows

    var contentString = 
      '<div class="container">' +
          /*'<img class="card-img-top" height="30px" src="data:image/png;base64,' + benefit.image +'" alt="map-image' + benefit.id + '">' +*/
          '<div class="card-body">' +
            '<h5 class="box-panel-closest__title">' + benefit.name  +'</h5>' +
            '<p class="box-panel-closest__text">' + benefit.description +'</p>' +
          '<a href="' + benefit.id +'" class="btn button-style pull-right">Ver más</a>' +
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

back(){
  this.navCtrl.pop();
}


toast(message) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: 'bottom'
  });

  toast.present();
}

}
