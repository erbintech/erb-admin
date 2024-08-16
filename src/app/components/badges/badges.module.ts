import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgesComponent } from './badges.component';
import { BadgesRoutingModule } from './badges-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BadgesComponent
  ],
  imports: [
    CommonModule,
    BadgesRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BadgesModule { }
