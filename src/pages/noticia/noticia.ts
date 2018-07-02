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

  items;
  showList;
  token;

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
      content: '<img src="../../assets/spinner3.gif"/>',
      dismissOnPageChange: false
    });
    loading.present();
    loading.dismiss();
    console.log('ionViewDidLoad NoticiaPage');
  }

  ionViewWillEnter() {
    var id = this.navParams.get('id');
    var token = 'Bearer' + this.navParams.get('token');
    this.token = token;
    this.getNew(id, token);
    this.initializeItems();
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

  getNew(id, token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>',
      dismissOnPageChange: false
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
