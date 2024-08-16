import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditCardDetailRoutingModule } from './credit-card-detail-routing.module';
import { CreditCardDetailComponent } from './credit-card-detail.component';



@NgModule({
    declarations: [
        CreditCardDetailComponent
    ],
    imports: [
        CommonModule,
        CreditCardDetailRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class CreditCardDetailModule { }
