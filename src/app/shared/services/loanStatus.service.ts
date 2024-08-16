import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoanStatusService {

    constructor(private http: HttpClient) { }

    async getLoanStatus(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/getLoanStatus", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async changeLoanStatus(customerLoanId: number, loanStatusId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "customerLoanId": customerLoanId, "loanStatusId": loanStatusId }))
        return await this.http.post(environment.apiUrl + "/api/admin/loanStatus/changeLoanStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }
}