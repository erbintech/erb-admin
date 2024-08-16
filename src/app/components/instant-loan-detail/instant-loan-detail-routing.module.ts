import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstantLoanDetailComponent } from './instant-loan-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InstantLoanDetailComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InstantLonDetailRoutingModule { }
