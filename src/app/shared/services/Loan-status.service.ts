import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoanService {

    constructor(private http: HttpClient) { }

    async getLoanStatus(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/getLoanStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertLoanStatus(status: string, isDataEditable: boolean, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "status": status, "isDataEditable": isDataEditable }));
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/insertLoanStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateLoanStatus(id: number, status: string, isDataEditable: boolean, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "status": status, "isDataEditable": isDataEditable }));
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/updateLoanStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveLoanStatus(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/activeInactiveLoanStatus", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}