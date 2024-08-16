import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BankLoanService {

    constructor(private http: HttpClient) { }

    async getBankLoans(startIndex: number, fetchRecords: number, bankIds:any , serviceIds:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "bankIds": bankIds , "serviceIds": serviceIds }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankLoans/getBankLoans", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBankLoan(loanName: string, bankId: number, serviceId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "loanName": loanName, "bankId": bankId, "serviceId": serviceId }));
        return await this.http.post(environment.apiUrl + "/api/admin/bankLoans/insertBankLoan", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBankLoan(id: number, loanName: string, bankId: number, serviceId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "loanName": loanName, "bankId": bankId, "serviceId": serviceId }));
        return await this.http.post(environment.apiUrl + "/api/admin/bankLoans/updateBankLoan", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBankLoan(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/bankLoans/activeInactiveBankLoan", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}