import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommissionRoutingModule } from './commission-routing.module';
import { CommissionComponent } from './commission.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
    declarations: [CommissionComponent],
    imports: [
        CommonModule,
        CommissionRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        ReactiveFormsModule,
        MatSelectModule
    ]
})
export class CommissionModule { }
