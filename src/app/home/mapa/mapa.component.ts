import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as L from 'leaflet';
import { ModalComponent } from '../modal/modal.component';
import { UtilsService } from 'src/app/services/utils/utils.sevice';
import { dataService } from 'src/app/services/data-service/data.service';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  private map!: L.Map;
  private ubicaciones!: any[];
  public LatLng: any;
  constructor(private modalController: ModalController, private ubicacionesService: dataService, private utilsService: UtilsService) {

  }

  ngOnInit() {
    this.getHidrantes();
  }
  async abrirModal(hidrante?: any) {
    if(this.LatLng || hidrante){
      const modal = await this.modalController.create({
        component: ModalComponent, // Componente del modal
        componentProps: { longitud: this.LatLng?.lng, latitud: this.LatLng?.lat, data: hidrante }, // Parámetros opcionales para pasar al modal
      });
  
      modal.onDidDismiss().then((data) => {
        if (data && data.data) {
          this.getHidrantes();
        }
      });
  
      await modal.present();
    }else{
      this.utilsService.presentToast(
        'Ubique el marcador correctamente',
        'long',
        'bottom'
      );
    }
    
  }


  async getHidrantes() {
    await this.utilsService.presentLoading('Cargando...');
    this.ubicacionesService.getHidrantes().subscribe(
      (resp) => {
        this.utilsService.dismissLoading();
        this.ubicaciones = resp.hidrantes
        if (this.map){
          this.agregarMarcadores();
        }else{
          this.initMap();

        }
      },
      (err: any) => {
        this.utilsService.dismissLoading();
        this.utilsService.presentToast(
          'Ocurrio un error inesperado',
          'long',
          'bottom'
        );
      }
    );
  }
  private initMap() {
    this.map = L.map('map').setView([4.7477, -75.9142], 14);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }
    ).addTo(this.map);
    this.agregarMarcadores();
  }

  getImg(value: string): string {
    if (value == 'pos') {
      return 'assets/icon/blue-icon.png'
    }
    if (value == 'true') {
      return 'assets/icon/red-icon.png'
    }
    return 'assets/icon/yellow-icon.png'
  }

  agregarMarcadores() {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    this.ubicaciones.forEach((ubicacion) => {
      const marker = L.marker([ubicacion.latitude, ubicacion.longitude], { icon: this.createIcon(ubicacion.checked.toString()) })
        .addTo(this.map)
        .bindPopup('Ir al detalle');

      marker.on('popupopen', () => {
        this.abrirModal(ubicacion);
        marker.closePopup();
      });
    });
    const initialMarker = L.marker([4.7477, -75.9142], { draggable: true, icon: this.createIcon('pos') }).addTo(this.map).on('dragend', (event) => {
      const marker = event.target;
      const position = marker.getLatLng(); // Obtener la nueva posición
      this.LatLng = position
    });;
  }

  createIcon(value?: string): any {
    if (value) {
      const customIconPos = L.icon({
        iconUrl: this.getImg(value),
        iconSize: value == 'pos' ? [30, 45] : [20, 35],
      });
      return customIconPos
    }
  }


}