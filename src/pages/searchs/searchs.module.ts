import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchsPage } from './searchs';

@NgModule({
  declarations: [
    SearchsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchsPage),
  ],
})
export class SearchsPageModule {}
