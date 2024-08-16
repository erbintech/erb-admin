import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessannualsaleComponent } from './business-annual-sale.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BusinessannualsaleComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BusinessAnnualSaleRoutingModule { }
