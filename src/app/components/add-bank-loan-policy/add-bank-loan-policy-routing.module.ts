import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBankLoanPolicyComponent } from './add-bank-loan-policy.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddBankLoanPolicyComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddBankLoanPolicyRoutingModule { }
