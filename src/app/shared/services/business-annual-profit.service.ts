import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusinessAnnualProfitService {

    constructor(private http: HttpClient) { }

    async getBusinessAnnualProfits(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualProfit/getBusinessAnnualProfits", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBusinessAnnualProfit(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualProfit/insertBusinessAnnualProfit", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBusinessAnnualProfit(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualProfit/updateBusinessAnnualProfit", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBusinessAnnualProfit(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/businessAnnualProfit/activeInactiveBusinessAnnualProfit", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}