import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorDetailComponent } from './connector-detail.component';
import { ConnectorDetailRoutingModule } from './connector-detail-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ConnectorDetailComponent
  ],
  imports: [
    CommonModule,
    ConnectorDetailRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class ConnectorDetailModule { }
