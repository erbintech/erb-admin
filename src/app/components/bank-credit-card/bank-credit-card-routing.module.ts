import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankCreditCardComponent } from './bank-credit-card.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: BankCreditCardComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class BankCreditCardRoutingModule { }
