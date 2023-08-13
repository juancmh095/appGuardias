import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CerrarDiaPage } from '../cerrar-dia/cerrar-dia';
import { NovedadesPage } from '../novedades/novedades';
import { PerfilPage } from '../perfil/perfil';
import { VisitasPage } from '../visitas/visitas';
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import config from '../../api';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  api:string = config.api;
  pages:any = {
    visita: VisitasPage,
    novedades: NovedadesPage,
    perfil: PerfilPage,
    cerrar: CerrarDiaPage
  };

  info:any = {
    usuario:'',
    empresa:'',
    suc:''
  };

  constructor(public navCtrl: NavController, private alertController: AlertController,public _http: HttpClient,private nativeStorage: NativeStorage) {
    var data:any = localStorage.getItem('guardia');
    if(data){
      data = JSON.parse(data);
      this.info.usuario = data.name;
      this.info.empresa = data.company.name;
      this.info.suc = data.branch;
    }else{
      this.presentAlert();  
    }
  } 

  

  goToPage(pageView:any){
    this.navCtrl.push(this.pages[pageView]);
  }


  async presentAlert() {
    var t = this;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Ingresa tu clave de acceso',
      
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Clave de acceso',
        },
      ],
      buttons: [
        {
          text: 'Iniciar',
          handler: (value) => {
            console.log(value);
            try {
              t._http.post(t.api+'/guardia/login',{key:value.key}).subscribe(async (response:any) =>{
                console.log(response);
                if(response.err){
                  t.presentAlert();
                }else{

                  var data = response.data;
                  localStorage.setItem('guardia',JSON.stringify(data));
                  localStorage.setItem('reportes','[]');
                  t.nativeStorage.setItem('reportes',[]).then(response => {
                    console.log(response);
                  });
                  t.info.usuario = data.name;
                  t.info.empresa = data.company.name;
                  t.info.suc = data.branch;
                  return true;
                }
              });              
            } catch (error) {
              return false;
            }
            /* t.sGeneral.login({key:value.key}).then(response =>{
              if(response.err){
                return false;
              }else{
                return true;
              }
            }); */
          },
        },
      ],
    });

    console.log(alert);

    alert.data.enableBackdropDismiss = false;

    await alert.present();

    
  }


}
