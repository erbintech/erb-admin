import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionComponent } from './commission.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CommissionComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CommissionRoutingModule { }
