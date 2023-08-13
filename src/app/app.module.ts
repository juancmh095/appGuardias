import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CerrarDiaPage } from '../pages/cerrar-dia/cerrar-dia';
import { NovedadesPage } from '../pages/novedades/novedades';
import { PerfilPage } from '../pages/perfil/perfil';
import { VisitasPage } from '../pages/visitas/visitas';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Base64 } from '@ionic-native/base64';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CerrarDiaPage,
    NovedadesPage,
    PerfilPage,
    VisitasPage
  ],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CerrarDiaPage,
    NovedadesPage,
    PerfilPage,
    VisitasPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Base64, 
    SpinnerDialog,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
