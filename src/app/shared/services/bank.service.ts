import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Bank } from '../models/bank';

@Injectable({
    providedIn: 'root'
})
export class BankService {

    constructor(private http: HttpClient) { }

    async getBanks(startIndex: number, fetchRecords: number, searchString: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString }))
        return await this.http.post(environment.apiUrl + "/api/admin/banks/getBanks", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBank(bank:Bank,token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/banks/insertBank", bank, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBank(bank:Bank,token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/banks/updateBank", bank, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBank(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/banks/activeInactiveBank", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}