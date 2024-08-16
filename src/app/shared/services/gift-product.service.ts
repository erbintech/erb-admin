import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GiftProduct } from '../models/gift-product';

@Injectable({
    providedIn: 'root'
})
export class GiftProductService {

    constructor(private http: HttpClient) { }

    async getProducts(startIndex: number, fetchRecords: number, searchString: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString":searchString }))
        return await this.http.post(environment.apiUrl + "/api/admin/products/getProducts", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async inserUpdateProducts(giftProduct: GiftProduct, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/products/inserUpdateProducts", giftProduct, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveProducts(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/products/activeInactiveProducts", parameter, { headers: reqHeader })
            .toPromise() as any;
    }
    
}