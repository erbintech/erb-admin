import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitingCardComponent } from './visiting-card.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: VisitingCardComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VisitingCardRoutingModule { }
