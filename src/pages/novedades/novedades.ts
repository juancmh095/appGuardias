import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Novedades } from '../../interfaces/Novedades';
import { HttpClient } from '@angular/common/http';
import config from '../../api';
import { AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
/**
 * Generated class for the NovedadesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-novedades',
  templateUrl: 'novedades.html',
})
export class NovedadesPage {
  api:string = config.api;
  model:Novedades;
  guardia:any; 

  constructor(public navCtrl: NavController, public navParams: NavParams,public _http:HttpClient, private alertController: AlertController, private camera: Camera,private spinnerDialog: SpinnerDialog,private nativeStorage: NativeStorage) {
    this.modelInit();
    var data= localStorage.getItem('guardia');
    this.guardia = JSON.parse(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovedadesPage');
    this.modelInit();
  }

  modelInit(){
    this.model = {
      company: '',
      employee: '',
      branch: '',
      area: '',
      date: '',
      hour: '',
      description: '',
      motivoNoFoto: '',
      images: [],
    }
  }

  save(){
    this.model.company = this.guardia.company._id;
    this.model.employee = this.guardia._id;
    this.model.branch = this.guardia.branch;
    this.spinnerDialog.show();
    this._http.post(this.api+'/novedades/nuevo',this.model).subscribe((response:any) =>{
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

  tomarPhotos(){
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
     this.model.images.push(base64Image);     
     
    }, (err) => {
     // Handle error
    });
  }
}
