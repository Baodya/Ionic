import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MainPageRoutingModule} from './main-routing.module';

import {MainPage} from './main.page';
import {HeaderComponent} from '../../components/header/header.component';
import {OptionsComponent} from './components/option-component/options.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
  ],
  providers: [],
  declarations: [MainPage, HeaderComponent, OptionsComponent]
})
export class MainPageModule {}
