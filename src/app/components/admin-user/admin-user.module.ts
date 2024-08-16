import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserComponent } from './admin-user.component';
import { AdminUserRoutingModule } from './admin-user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AdminUserComponent
  ],
  imports: [
    CommonModule,
    AdminUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MaterialModule,
    SharedModule,
    NgSelectModule
  ]
})
export class AdminUserModule { }
