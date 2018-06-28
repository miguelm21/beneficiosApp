import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeneficioPage } from './beneficio';

@NgModule({
  declarations: [
    BeneficioPage,
  ],
  imports: [
    IonicPageModule.forChild(BeneficioPage),
  ],
})
export class BeneficioPageModule {}
