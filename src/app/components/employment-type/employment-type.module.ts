import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmploymentTypeComponent } from './employment-type.component';
import { EmploymentTypeRoutingModule } from './employment-type-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
    declarations: [EmploymentTypeComponent],
    imports: [
        CommonModule,
        EmploymentTypeRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class EmploymentTypeModule { }
