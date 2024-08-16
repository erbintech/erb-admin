import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerComponent } from './customer.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [CustomerComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class CustomerModule { }
