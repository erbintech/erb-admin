import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DsaRoutingModule } from './dsa-routing.module';
import { DsaComponent } from './dsa.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [DsaComponent],
    imports: [
        CommonModule,
        DsaRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class DsaModule { }
