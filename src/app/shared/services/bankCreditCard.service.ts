import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BankCreditCard } from '../models/bankCreditCard';
import { BankCreditCardPolicy } from '../models/bankCreditCardPolicy';

@Injectable({
    providedIn: 'root'
})
export class BankCreditCardService {

    constructor(private http: HttpClient) { }

    async getBankCredtiCard(startIndex: number, fetchRecords: number, bankIds:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "bankId": bankIds }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankCreditCard/getBankCreditCard", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBankCreditCard(bankCreditCard: BankCreditCard, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/bankCreditCard/insertUpdateBankCreditCard", bankCreditCard, { headers: reqHeader })
            .toPromise() as any
    }

    async getBankCredtiCardPolicy(startIndex: number, fetchRecords: number, selectedBank: number, selectedCompanyCategoryType: number, minAge: number, maxAge: number, minCibilScore: number, selectedEmploymentType: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "selectedBank": selectedBank, "selectedCompanCategoryType": selectedCompanyCategoryType, "minAge": minAge, "maxAge": maxAge, "minCibilScore": minCibilScore, "selectedEmploymentType": selectedEmploymentType }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankCreditCardPolicy/getBankCreditCardPolicy", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCompanyCategoryTypes(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/bankCreditCardPolicy/getCompanyCategoryType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBankCreditCardPolicy(bankCreditCard: BankCreditCardPolicy, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/bankCreditCardPolicy/insertUpdateBankCreditCardPolicy", bankCreditCard, { headers: reqHeader })
            .toPromise() as any
    }
}