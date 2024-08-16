import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BankCreditCardPolicyRoutingModule } from './bank-credit-card-policy-routing.module';
import { BankCreditCardPolicyComponent } from './bank-credit-card-policy.component';


@NgModule({
    declarations: [
        BankCreditCardPolicyComponent
    ],
    imports: [
        CommonModule,
        BankCreditCardPolicyRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        AngularEditorModule
    ]
})
export class BankCreditCardPolicyModule { }
