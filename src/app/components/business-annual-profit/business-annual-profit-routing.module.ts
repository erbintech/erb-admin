import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessAnnualProfitComponent } from './business-annual-profit.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BusinessAnnualProfitComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BusinessAnnualProfitRoutingModule { }
