import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConnectorRoutingModule } from './connector-routing.module';
import { ConnectorComponent } from './connector.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [ConnectorComponent],
    imports: [
        CommonModule,
        ConnectorRoutingModule,
        FormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class ConnectorModule { }
