import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLapComponent } from './add-lap.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: AddLapComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class AddLapRoutingModule { }
