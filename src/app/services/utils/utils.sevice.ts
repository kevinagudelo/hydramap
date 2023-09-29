import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private isLoaderShown = false;
  private loader: any;
  private modalMap: Map<string, HTMLIonModalElement> = new Map<string, HTMLIonModalElement>();

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public alertController: AlertController,
    public toastController: ToastController,
    private loadingCtrl: LoadingController,
  ) {

  }

  async presentLoading(mensaje:string) {
    if (this.isLoadingPresent) {
      this.setLoaderText(mensaje);
      return Promise.resolve();
    }
    let initTime;
    let finishTime;
    this.loader = await this.loadingCtrl.create({
      message: mensaje,
      translucent: true,
      spinner: 'dots',
      // cssClass: 'app-loader',
      animated: true
    });
    this.loader.onDidDismiss().then(() => {
      this.isLoaderShown = false;
      this.loader = null;
      finishTime = new Date().getTime();
    });

    return this.loader.present().then(() => {
      this.isLoaderShown = true;
      initTime = new Date().getTime();
    });
  }

  async dismissLoading() {
    return await this.loadingCtrl.dismiss().then(() => {
      this.isLoaderShown = false;
    }).catch(() => {
      this.isLoaderShown = false;
    });
  }



  get isLoadingPresent() {
    return this.isLoaderShown;
  }

  setLoaderText(text: string) {
    if (this.loader) {
      this.loader.message = text;
    }
  }


  async presentToast(messageT:any, durationT?: 'short' | 'long', positionT?: "bottom" | "top" | "middle") {
    const toast = await this.toastController.create({
      color: 'dark',
      message: messageT,
      position: positionT ? positionT : 'bottom',
      duration: durationT ? durationT === 'short' ? 3000 : 5000 : 3000
    });
    await toast.present();
  }


 


}
