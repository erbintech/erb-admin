import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankLoanComponent } from './bank-loan.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BankLoanComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BankLoanRoutingModule { }
