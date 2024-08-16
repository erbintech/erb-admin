import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoanAgainstCollteralService {

    constructor(private http: HttpClient) { }

    async getLoanAginstCollteral(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/loanAgainstCollteral/getLoanAginstCollteral", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertLoanAgainstCollteral(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/loanAgainstCollteral/insertLoanAgainstCollteral", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateLoanAgainstCollteral(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/loanAgainstCollteral/updateLoanAgainstCollteral", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveLoanAgainstCollteral(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/loanAgainstCollteral/activeInactiveLoanAgainstCollteral", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}