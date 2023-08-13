import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Visita } from '../../interfaces/Visita';
import { HttpClient } from '@angular/common/http';
import config from '../../api';
import { AlertController } from 'ionic-angular';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';


/**
 * Generated class for the VisitasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visitas',
  templateUrl: 'visitas.html',
})
export class VisitasPage {
  api:'' = config.api;
  model:Visita;
  guardia:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public _http:HttpClient, 
    private alertController: AlertController, 
    private camera: Camera, 
    private spinnerDialog: 
    SpinnerDialog, 
    private nativeStorage: NativeStorage) 
    {
    this.modelInit();
    var data= localStorage.getItem('guardia');
    this.guardia = JSON.parse(data);
    console.log(new Date())
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovedadesPage');
    this.modelInit();
  }

  modelInit(){
    this.model = {
      visit: '',
      name: '',
      branch: '',
      company: '',
      employee: '',
      area: '',
      date: '',
      type: '',
      hour: '',
      description: '',
      ide: '',
      visitImg: '',
    }
  }

  save(){
    this.model.company = this.guardia.company._id;
    this.model.employee = this.guardia._id;
    this.model.branch = this.guardia.branch;
    this.spinnerDialog.show();
    this._http.post(this.api+'/visitas/nuevo',this.model).subscribe((response:any) =>{
      console.log('aqui',response);
      if(response.err){
        this.presentAlert('Error de consulta, Intente nuevamente');
      }else{
        this.spinnerDialog.hide();
        this.presentAlert('Éxito, al procesar la solicitud');
        this.modelInit();
        this.localstorageAdd(response.data);
      }
    });
  }

  async presentAlert(title) {
    var t = this;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: title,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('ok');
          },
        },
      ],
    });

    console.log(alert);

    alert.data.enableBackdropDismiss = false;

    await alert.present();

    
  }

  localstorageAdd(data:any){
    var t = this;
    this.nativeStorage.getItem('reportes').then(response =>{
      console.log(response);
      data.reg = "VISIT";
      response.push(data);
      t.nativeStorage.setItem('reportes',response).then(data =>{
        console.log(data);
      });
    });

  }

  tomarIDE(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.model.ide=base64Image;     
     
    }, (err) => {
     // Handle error
    });
  }

  tomarVisita(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.model.visitImg=base64Image;     
     
    }, (err) => {
     // Handle error
    });
  }

}
