import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserScratchCardComponent } from './user-scratch-card.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: UserScratchCardComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UserScratchCardRoutingModule { }
