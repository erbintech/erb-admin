import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGetCommissionComponent } from './admin-get-commission.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AdminGetCommissionComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AdminGetCommissionRoutingModule { }
