import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { DomSanitizer} from '@angular/platform-browser';

/**
 * Generated class for the NoticiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-noticia',
  templateUrl: 'noticia.html',
})
export class NoticiaPage {
  id;
  title;
  text;
  day;
  month;
  image;
  user;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public toastCtrl: ToastController,
    public sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>'
    });
    loading.present();
    loading.dismiss();
    console.log('ionViewDidLoad NoticiaPage');
  }

  ionViewWillEnter() {
    var id = this.navParams.get('id');
    var token = 'Bearer' + this.navParams.get('token');
    this.getNew(id, token);
  }

  getNew(id, token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>'
    });

    loading.present();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', token);

    this.http.get(this.api + 'new/' + id, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => {
          var monthNames = [
            "Ene", "Feb", "Mar",
            "Abr", "May", "Jun", "Jul",
            "Ago", "Sep", "Oct",
            "Nov", "Dic"
          ];

          var date = new Date(data.new.date);

          var day = date.getDate();
          var monthIndex = date.getMonth();
          
          this.id = data.new.id;
          this.title = data.new.title;
          this.text = data.new.text;
          this.image = this.sanitizer.bypassSecurityTrustUrl('data:image/svg+xml+png+jpeg;base64,' + data.new.image);
          this.day = day;
          this.month = monthNames[monthIndex];
          this.user = data.new.user;
          loading.dismiss();
        },
        err => {
          if (err.status == 401){
            this.toast('No se encontro ninguna noticia');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
          loading.dismiss();
        },
      );
  }

  home(){
    this.navCtrl.popToRoot();
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
