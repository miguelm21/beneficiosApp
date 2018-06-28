import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { ComponentsModule } from '../../components/components.module';
// import { ComponentsModule } from '../../components/components.module';

@NgModule({
	declarations: [
	HomePage
	],
	schemas: [
	CUSTOM_ELEMENTS_SCHEMA
	],
	imports: [
	IonicPageModule.forChild(HomePage),
	ComponentsModule
	],
})
export class HomePageModule {}
