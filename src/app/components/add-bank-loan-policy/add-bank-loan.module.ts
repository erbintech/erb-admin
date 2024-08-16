import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddBankLoanPolicyRoutingModule } from './add-bank-loan-policy-routing.module';
import { AddBankLoanPolicyComponent } from './add-bank-loan-policy.component';

@NgModule({
    declarations: [
        AddBankLoanPolicyComponent
    ],
    imports: [
        CommonModule,
        AddBankLoanPolicyRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        // ArchwizardModule,
        NgSelectModule
    ]
})
export class AddBankLoanPolicyModule { }
