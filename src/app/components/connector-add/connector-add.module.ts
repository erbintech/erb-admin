import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorAddComponent } from './connector-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConnectorAddRoutingModule } from './connector-add-routing.module';

@NgModule({
  declarations: [
    ConnectorAddComponent
  ],
  imports: [
    CommonModule,
    ConnectorAddRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class ConnectorAddModule { }
