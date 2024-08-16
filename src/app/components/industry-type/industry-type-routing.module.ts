import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustryTypeComponent } from './industry-type.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: IndustryTypeComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IndustryTypeRoutingModule { }
