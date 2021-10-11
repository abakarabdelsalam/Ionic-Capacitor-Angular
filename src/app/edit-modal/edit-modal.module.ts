import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditModalPageRoutingModule } from './edit-modal-routing.module';

import { EditModalPage } from './edit-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditModalPageRoutingModule
  ],
  declarations: [EditModalPage]
})
export class EditModalPageModule { }
