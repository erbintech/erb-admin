import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessExperienceRoutingModule } from './business-experience-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessExperienceComponent } from './business-experience.component';



@NgModule({
  declarations: [
    BusinessExperienceComponent
  ],
  imports: [
    CommonModule,
    BusinessExperienceRoutingModule,
    MaterialModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BusinessExperienceModule { }
