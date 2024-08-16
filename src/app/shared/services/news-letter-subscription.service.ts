import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GiftProduct } from '../models/gift-product';

@Injectable({
    providedIn: 'root'
})
export class NewsLetterSubscriptionService {

    constructor(private http: HttpClient) { }

    async getNewsLetterSubscription(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        // let parameter = JSON.parse(JSON.stringify({ "fromDate": fromDate, "toDate": toDate, "statusIds": statusIds , "startIndex": startIndex, "fetchRecord": fetchRecord, "searchString":searchString }))
        return await this.http.post(environment.apiUrl + "/api/admin/newsLetterSubscription/getNewsLetterSubscription", {}, { headers: reqHeader })
            .toPromise() as any
    }
    
}