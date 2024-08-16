import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactRequestComponent } from './contact-request.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ContactRequestComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContactRequestRoutingModule { }
