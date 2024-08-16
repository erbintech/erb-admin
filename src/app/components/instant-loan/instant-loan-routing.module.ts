import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstantLoanComponent } from './instant-loan.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: InstantLoanComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InstantLonRoutingModule { }
