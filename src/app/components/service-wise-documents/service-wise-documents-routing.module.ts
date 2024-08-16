import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWiseDocumentsComponent } from './service-wise-documents.component';


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ServiceWiseDocumentsComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServiceWiseDocumentsRoutingModule { }
