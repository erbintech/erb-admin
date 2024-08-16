import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessLoanDetailComponent } from './business-loan-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BusinessLoanDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BusinessLoanDetailRoutingModule { }
