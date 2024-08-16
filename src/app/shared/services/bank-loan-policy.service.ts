import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BankLoanPolicy } from '../models/bank-loan-policy';

@Injectable({
    providedIn: 'root'
})
export class BankLoanPolicyService {

    constructor(private http: HttpClient) { }

    async getBankLoanPolicy(bankId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "bankId": bankId }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankPolicies/getBankPolicy", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBankLoanPolicy(bankLoanPolicy: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/bankPolicies/insertUpdateBankPolicy", bankLoanPolicy, { headers: reqHeader })
            .toPromise() as any
    }
}