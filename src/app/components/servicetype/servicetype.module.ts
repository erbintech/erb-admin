import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicetypeComponent } from './servicetype.component';
import { ServicetypeRoutingModule } from './servicetype-routing.module';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';



@NgModule({
  declarations: [
    ServicetypeComponent
  ],

  imports: [
    CommonModule,
    ServicetypeRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule
  ]
})
export class ServicetypeModule { }
