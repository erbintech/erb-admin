import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BankLoanPolicyRoutingModule } from './bank-loan-policy-routing.module';
import { BankLoanPolicyComponent } from './bank-loan-policy.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        BankLoanPolicyComponent
    ],
    imports: [
        CommonModule,
        BankLoanPolicyRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class BankLoanPolicyModule { }
