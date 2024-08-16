import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelationManagerComponent } from './relation-manager.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: RelationManagerComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RelationManagerRoutingModule { }
