import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanAgainstCollteralComponent } from './loan-against-collteral.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LoanAgainstCollteralComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LoanAgainstCollteralRoutingModule { }
