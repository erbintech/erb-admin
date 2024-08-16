import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/shared/directives/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BannerComponent } from './banner.component';
import { BannerRoutingModule } from './banner-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
    declarations: [
        BannerComponent
    ],
    imports: [
        CommonModule,
        BannerRoutingModule,
        MaterialModule,
        SharedModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class BannerModule { }
