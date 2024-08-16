import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusinessAnnualSaleService {

    constructor(private http: HttpClient) { }

    async getBusinessAnnualSales(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualSale/getBusinessAnnualSales", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBusinessAnnualSale(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualSale/insertBusinessAnnualSale", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBusinessAnnualSale(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualSale/updateBusinessAnnualSale", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBusinessAnnualSale(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualSale/activeInactiveBusinessAnnualSale", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}