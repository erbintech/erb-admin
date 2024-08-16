import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BecomePartnerRoutingModule } from './become-partner-routing.module';
import { BecomePartnerComponent } from './become-partner.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        BecomePartnerComponent
    ],
    imports: [
        CommonModule,
        BecomePartnerRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class BecomePartnerModule { }
