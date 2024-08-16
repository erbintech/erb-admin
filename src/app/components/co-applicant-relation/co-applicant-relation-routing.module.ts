import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoApplicantRelationComponent } from './co-applicant-relation.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: CoApplicantRelationComponent
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CoApplicantRelationRoutingModule { }
