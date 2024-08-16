import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SubdsaComponent } from './subdsa.component';
import { SubDsaRoutingModule } from './subdsa-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModule } from 'src/app/common/alert/alert.mocule';
@NgModule({
    declarations: [SubdsaComponent],
    imports: [
        CommonModule,
        SubDsaRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule,
        AlertModule
    ]
})
export class SubDsaModule { }