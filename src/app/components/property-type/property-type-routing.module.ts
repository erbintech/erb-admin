    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { PropertyTypeComponent } from './property-type.component';


    const routes: Routes = [
        {
            path: '',
            children: [
                {
                    path: '',
                    component: PropertyTypeComponent
                },
            ],
        }
    ];

    @NgModule({
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule],
    })

    export class PropertyTypeRoutingModule { }
