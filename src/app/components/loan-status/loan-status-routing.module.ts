import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanstatusComponent } from './loan-status.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LoanstatusComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LoanStatusRoutingModule { }
