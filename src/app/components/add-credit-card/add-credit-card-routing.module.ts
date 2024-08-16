import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCreditCardComponent } from './add-credit-card.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddCreditCardComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddCreditCardRoutingModule { }
