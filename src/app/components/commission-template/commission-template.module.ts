import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommissionTemplateComponent } from './commission-template.component';
import { CommissionTemplateRoutingModule } from './commission-template-routing.module';

@NgModule({
    declarations: [CommissionTemplateComponent],
    imports: [
        CommonModule,
        CommissionTemplateRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class CommissionTemplateModule { }
