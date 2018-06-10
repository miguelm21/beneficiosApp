import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { ImageViewerController } from 'ionic-img-viewer';

import { BeneficioPage } from '../beneficio/beneficio';
/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  @ViewChild('myElement') myElem;
  section: string;
  id;
  token;
  show;
  _imageViewerCtrl: ImageViewerController;

  category: Object[];
  categories: Array<any>;
  benefits: Array<any>;
  benefs: Array<any>;

  api = 'https://clubbeneficiosuno.goodcomex.com/beneficios/public/api/';

  items;
  showList;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    var id = this.navParams.get('id');
    var token = this.navParams.get('token');
    this.id = this.navParams.get('id');
    this.token = this.navParams.get('token');
    this.getCategory(id, token);
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

  getCategory(id, token) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: '<img src="../../assets/spinner3.gif"/>'
    });

    loading.present();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Authorization', token);

    this.http.get(this.api + 'category/' + id, { headers: headers })
      .map(res => res.json())
      .subscribe(
        data => { 
          this.category = data.category;
          this.categories = data.categories;
          this.benefits = data.benefits;
          this.section = id;
          this.filterBenefits(id);
          loading.dismiss();
        },
        err => {
          if (err.status == 401){
            this.toast('No se encontro ninguna categoria');
          } else if (err.status == 500) {
            this.toast('Ocurrio un error');
          } else {
            this.toast('Ocurrio un error');
          }
          loading.dismiss();
        },
      );
  }

  PostBenefit(id) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Authorization', this.token);

        var credentials = JSON.stringify({ id: id });
        this.http.post('http://127.0.0.1:8000/api/postbenefit/', credentials, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { this.toast('Beneficio Guardado'); this.getCategory(this.id, this.token); },
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

        this.http.delete('http://127.0.0.1:8000/api/unpostbenefit/' + id, { headers: headers })
          .map(res => res.json())
          .subscribe(
            data => { this.toast('Beneficio Borrado'); this.getCategory(this.id, this.token); },
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

  filterBenefits(id){
    this.benefs = this.benefits.filter(
          benefit => benefit.category_id === id);
    this.section = id;
  }

  home(){
  	this.navCtrl.popToRoot();
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
}
