import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessLoanRoutingModule } from './businessloan-routing.module';
import { BusinessloanComponent } from './businessloan.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
    declarations: [BusinessloanComponent],
    imports: [
        CommonModule,
        BusinessLoanRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        AngularEditorModule,
        NgApexchartsModule
    ]
})
export class BusinessLoanModule { }
