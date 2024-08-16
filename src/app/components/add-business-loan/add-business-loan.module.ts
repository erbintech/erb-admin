import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddBusinessLoanRoutingModule } from './add-business-loan-routing.module';
import { AddBusinessLoanComponent } from './add-business-loan.component';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddBusinessLoanComponent
    ],
    imports: [
        CommonModule,
        AddBusinessLoanRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule
    ]
})
export class AddBusinessLoanModule { }