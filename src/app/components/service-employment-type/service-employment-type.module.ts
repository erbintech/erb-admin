import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceEmploymentTypeRoutingModule } from './service-employment-type-routing.module';
import { ServiceEmploymentTypeComponent } from './service-employment-type.component';

@NgModule({
    declarations: [ServiceEmploymentTypeComponent],
    imports: [
        CommonModule,
        ServiceEmploymentTypeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule
    ]
})
export class ServiceEmploymentTypeModule { }
