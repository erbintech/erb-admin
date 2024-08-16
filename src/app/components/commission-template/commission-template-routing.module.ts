import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionTemplateComponent } from './commission-template.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CommissionTemplateComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CommissionTemplateRoutingModule { }
