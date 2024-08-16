import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessloanComponent } from './businessloan.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BusinessloanComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BusinessLoanRoutingModule { }
