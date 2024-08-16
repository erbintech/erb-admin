import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsLetterSubscriptionComponent } from './news-letter-subscription.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: NewsLetterSubscriptionComponent
            },
        ],
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewsLetterSubscriptionRoutingModule { }