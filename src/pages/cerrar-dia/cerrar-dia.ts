import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Reporte } from '../../interfaces/Reportes';
import { HttpClient } from '@angular/common/http';
import config from '../../api';
import { AlertController } from 'ionic-angular';
import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
/**
 * Generated class for the CerrarDiaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cerrar-dia',
  templateUrl: 'cerrar-dia.html',
})
export class CerrarDiaPage {
  signaturePad: SignaturePad;
  @ViewChild('canvas') canvasEl : ElementRef;
  signatureImg: string;
  api:string = config.api;
  model:Reporte;
  guardia:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public _http:HttpClient, private alertController: AlertController,private spinnerDialog: SpinnerDialog,private nativeStorage: NativeStorage) {
    this.modelInit();
    var data= localStorage.getItem('guardia');
    this.guardia = JSON.parse(data);
    console.log(new Date())
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CerrarDiaPage');
    var t = this;
    this.nativeStorage.getItem('reportes').then(response => {
      console.log(response);      
      t.model.activities = response;
    });
  }  

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement);
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    console.log(base64Data);
    this.model.firma = base64Data;
    this.signatureImg = base64Data;

    this.save();
  }

  save(){
    this.model.company = this.guardia.company._id;
    this.model.guardia = this.guardia._id;
    this.model.branch = this.guardia.branch;
    this.spinnerDialog.show();
    this._http.post(this.api+'/reportes/nuevo',this.model).subscribe((response:any) =>{
      console.log('aqui',response);
      if(response.err){
        this.presentAlert('Error de consulta, Intente nuevamente');
      }else{
        this.spinnerDialog.hide();
        this.presentAlert('Éxito, al procesar la solicitud');
        this.modelInit();
        localStorage.clear();
        this.signaturePad.clear();
        setTimeout(() => {
          window.location.reload();
        }, 700);
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

  modelInit(){
    this.model = {
      company: '',
      guardia: '',
      branch: '',
      firma: '',
      activities:[]
    }
  }

}
