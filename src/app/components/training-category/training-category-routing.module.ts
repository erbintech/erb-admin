import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingCategoryComponent } from './training-category.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: TrainingCategoryComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TrainingCategoryRoutingModule { }
