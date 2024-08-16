import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserScratchCardRoutingModule } from './user-scratch-card-routing.module';
import { UserScratchCardComponent } from './user-scratch-card.component';

@NgModule({
    declarations: [UserScratchCardComponent],
    imports: [
        CommonModule,
        UserScratchCardRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        MaterialModule,
        SharedModule,
        NgSelectModule
    ]
})
export class UserScratchCardModule { }
