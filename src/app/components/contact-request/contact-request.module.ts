import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContactRequestRoutingModule } from './contact-request-routing.module';
import { ContactRequestComponent } from './contact-request.component';



@NgModule({
    declarations: [
        ContactRequestComponent
    ],
    imports: [
        CommonModule,
        ContactRequestRoutingModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
    ]
})
export class ContactRequestModule { }
