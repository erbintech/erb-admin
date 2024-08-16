import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LAPComponent } from './lap.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LAPComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class LAPRoutingModule { }
