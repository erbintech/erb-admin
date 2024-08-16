import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaritalstatusesComponent } from './maritalstatuses.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: MaritalstatusesComponent
            },
        ],
    }
 ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class MaritalstatusesRoutingModule { }
