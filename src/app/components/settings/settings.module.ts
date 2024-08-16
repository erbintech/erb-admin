import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
    declarations: [SettingsComponent],
    imports: [
        CommonModule,
        SettingsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class SettingsModule { }
