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

  benefit: Object[];
  Pos;
  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

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
    this.getData(id, token);
  }

  getData(id, token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>'
    });
    loading.present();

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', token);

    this.http.get(this.api + 'benefit/' + id, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => {
          /*var benef = [];*/
          /*data.benefit.forEach(function(data) {
            var img = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + data.image);
            benef.push({ id: data.id, name: data.name, description: data.description, image: img, iconmap: data.iconmap, category: data.category});
          }, this);*/
          /*Array.prototype.forEach.call(data, data => {
            console.log(data);
            var img = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + data.image);
            benef.push({ id: data.id, name: data.name, description: data.description, image: img, iconmap: data.iconmap, category: data.category});
          });*/
          this.benefit = data.benefit;
          this.initMap(this.benefit, this.latitude, this.longitude);
          loading.dismiss();
        },
        err => {
          if (err.status == 401){
            this.toast('No se encontraron datos');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
          loading.dismiss();
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
    var Centro = { lat: benefit.latitude, lng: benefit.longitude };
    var Me = { lat: latitude, lng: longitude };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: Centro,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    //InforWindows

    var contentString = 
      '<div class="container">' +
          '<img class="card-img-top" height="30px" src="data:image/png;base64,' + benefit.image +'" alt="map-image' + benefit.id + '">' +
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

/*  }).catch((error) => {
      alert('Error getting location');
  });*/
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
