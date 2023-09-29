import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { environment } from 'src/environments/environment';

import { ModalComponent } from './modal/modal.component';
import { MapaComponent } from './mapa/mapa.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage,MapaComponent, ModalComponent]
})
export class HomePageModule {}
