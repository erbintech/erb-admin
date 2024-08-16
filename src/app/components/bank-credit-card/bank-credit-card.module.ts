import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { BankCreditCardRoutingModule } from './bank-credit-card-routing.module';
import { BankCreditCardComponent } from './bank-credit-card.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
    declarations: [
        BankCreditCardComponent
    ],
    imports: [
        CommonModule,
        BankCreditCardRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        AngularEditorModule
    ]
})
export class BankCreditCardModule { }
