import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IonicStorageModule } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

// import { ExpandableHeader } from '../components/expandable-header/expandable-header';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicImageViewerModule } from 'ionic-img-viewer';

// import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { HomePageModule } from '../pages/home/home.module';
import { CategoryPageModule } from '../pages/category/category.module';
import { NoticiaPageModule } from '../pages/noticia/noticia.module';
import { OpcionesPageModule } from '../pages/opciones/opciones.module';
import { PerfilPageModule } from '../pages/perfil/perfil.module';
import { EditperfilPageModule } from '../pages/editperfil/editperfil.module';
import { PasswordPageModule } from '../pages/password/password.module';
import { BeneficioPageModule } from '../pages/beneficio/beneficio.module';
import { SaveBenefitsPageModule } from '../pages/save-benefits/save-benefits.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp
    // HomePage,
    // ExpandableHeader
  ],
  // schemas: [
  // CUSTOM_ELEMENTS_SCHEMA
  // ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicImageViewerModule,
    LoginPageModule,
    RegisterPageModule,
    NoticiaPageModule,
    PerfilPageModule,
    EditperfilPageModule,
    OpcionesPageModule,
    PasswordPageModule,
    CategoryPageModule,
    BeneficioPageModule,
    SaveBenefitsPageModule,
    HomePageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    LocationAccuracy,
    OneSignal,
    Facebook,
    GooglePlus,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
