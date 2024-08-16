import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerDetailRoutingModule } from './customer-detail-routing.module';
import { CustomerDetailComponent } from './customer-detail.component';



@NgModule({
    declarations: [
        CustomerDetailComponent
    ],
    imports: [
        CommonModule,
        CustomerDetailRoutingModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
    ]
})
export class CustomerDetailModule { }
