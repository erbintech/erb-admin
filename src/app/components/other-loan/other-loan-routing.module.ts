import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherLoanComponent } from './other-loan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: OtherLoanComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class OtherLoanRoutingModule { }
