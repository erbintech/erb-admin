import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItrComponent } from './itr.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ItrComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class ItrRoutingModule { }
