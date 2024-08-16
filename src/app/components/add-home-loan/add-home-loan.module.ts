import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddHomeLoanComponent } from './add-home-loan.component';
import { AddHomeLoanRoutingModule } from './add-home-loan-routing.module';
// import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
    declarations: [
        AddHomeLoanComponent
    ],
    imports: [
        CommonModule,
        AddHomeLoanRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule
    ]
})
export class AddHomeLoanModule { }