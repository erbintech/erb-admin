import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankCreditCardPolicyComponent } from './bank-credit-card-policy.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BankCreditCardPolicyComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BankCreditCardPolicyRoutingModule { }
