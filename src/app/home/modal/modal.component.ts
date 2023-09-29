import { Component, Input, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Storage, uploadBytes, ref, getDownloadURL } from '@angular/fire/storage';
import { Capacitor } from '@capacitor/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dataService } from 'src/app/services/data-service/data.service';
import { UtilsService } from 'src/app/services/utils/utils.sevice';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})


export class ModalComponent  implements OnInit {
  constructor(private modalController: ModalController , private storage:Storage, private fb: FormBuilder, private ubicacionesService: dataService, private utilsService: UtilsService) { }
  dataForm!: FormGroup;

  @Input()
  public data: any;
  @Input()
  public longitud:any;
  @Input()
  public latitud: any;
  image:any;
  imageUrl :any;
  ngOnInit() {
    this.dataForm = this.fb.group(
      {
        description: ['', Validators.required],
        checked: [false ],
      },
      
    );

    if (this.data){
      this.dataForm.patchValue({
        description: this.data?.description,
        checked: this.data?.checked,
      });
      this.imageUrl = this.data.image
    }
   
  }
  async uploadImage(blob:any, image:any) {
    try {
      const currentDate = Date.now()
      const filePath = `test/${currentDate}.${image.format}`
      const fileRef = ref(this.storage, filePath)
      const task = await uploadBytes(fileRef, blob)
      console.log('task', task);
      const url = getDownloadURL(fileRef);
      return url
    } catch (e){
      throw(e)
    }
 
  }
 
 
   takePicture = async () => {
    try {
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
      });
   
      const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = image.dataUrl as string;

    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const aspectRatio = img.width / img.height;
    const targetWidth = 750;
    const targetHeight = Math.round(targetWidth / aspectRatio);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
    const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    this.image = resizedDataUrl;
    const blob = this.dataURLtoBlob(resizedDataUrl);
    this.utilsService.presentLoading('Cargando...');
    const url = await this.uploadImage(blob, image);
    this.utilsService.dismissLoading();
    this.imageUrl = url
    console.log(url);
    } catch (error) {
      this.utilsService.presentToast(
        'Ocurrio un error inesperado',
        'long',
        'bottom'
      );
    }
   
  
  };
  dataURLtoBlob(daturl:any){
    var arr = daturl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime})
  }

  onSubmit() {
    if (this.dataForm.valid) {
      
      if (this.data){
        const data = {
          id: this.data.id,
          description: this.dataForm.get('description')?.value,
          checked: this.dataForm.get('checked')?.value,
          image: this.imageUrl,
          longitude:  this.data.longitude ,
          latitude: this.data.latitude
        };
        this.updateHidrante(data);
      }else{
        const data = {
          description: this.dataForm.get('description')?.value,
          checked: this.dataForm.get('checked')?.value,
          image: this.imageUrl,
          longitude:  this.longitud.toString(),
          latitude:  this.latitud.toString()
        };
        this.createHidrante(data);

      }
    } else {
      this.dataForm.markAllAsTouched();
    }
  }

  async cerrarModal(event?:string) {
    if (event){
      await this.modalController.dismiss(event);
    }else{
      await this.modalController.dismiss();
    }
    
  }

  async createHidrante(data:any) {
    await this.utilsService.presentLoading('Cargando...');
    this.ubicacionesService.createHidrante(data).subscribe(
      (resp) => {
      this.utilsService.dismissLoading();
       console.log(resp);
       this.utilsService.presentToast(
        'Se creo el punto correctamente',
        'long',
        'bottom'
      );
      this.cerrarModal('event');
      },
      (err:any) => {
        this.utilsService.dismissLoading();
        this.utilsService.presentToast(
          'Ocurrio un error inesperado',
          'long',
          'bottom'
        );
        
      }
    );
  }

  async updateHidrante(data:any) {
    await this.utilsService.presentLoading('Cargando...');
    this.ubicacionesService.updateHidrante(data).subscribe(
      (resp) => {
      this.utilsService.dismissLoading();
       console.log(resp);
       this.utilsService.presentToast(
        'Se actualizo el punto correctamente',
        'long',
        'bottom'
      );
      this.cerrarModal('event');
      },
      (err:any) => {
        this.utilsService.dismissLoading();
        this.utilsService.presentToast(
          'Ocurrio un error inesperado',
          'long',
          'bottom'
        );
        
      }
    );
  }
}
