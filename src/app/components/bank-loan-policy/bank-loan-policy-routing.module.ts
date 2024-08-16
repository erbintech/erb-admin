import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankLoanPolicyComponent } from './bank-loan-policy.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BankLoanPolicyComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BankLoanPolicyRoutingModule { }
