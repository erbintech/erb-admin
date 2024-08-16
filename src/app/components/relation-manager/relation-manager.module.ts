import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelationManagerComponent } from './relation-manager.component';
import { RelationManagerRoutingModule } from './relation-manager-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AlertModule } from 'src/app/common/alert/alert.mocule';

@NgModule({
    declarations: [RelationManagerComponent],
    imports: [
        CommonModule,
        RelationManagerRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        AlertModule
    ]
})
export class RelationManagerModule { }
