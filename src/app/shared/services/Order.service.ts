import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private http: HttpClient) { }

    async getOrders(fromDate: Date, toDate: Date, statusIds:any, startIndex: number, fetchRecord: number, searchString: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fromDate": fromDate, "toDate": toDate, "statusIds": statusIds , "startIndex": startIndex, "fetchRecord": fetchRecord, "searchString":searchString }))
        return await this.http.post(environment.apiUrl + "/api/admin/orders/getOrders", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getOrderStatus(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/orders/getOrderStatus", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async changeOrderStatus(orderId: number, statusId: number, remark: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "orderId": orderId, "statusId": statusId, "remark": remark }))
        return await this.http.post(environment.apiUrl + "/api/admin/orders/changeOrderStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }
    
}