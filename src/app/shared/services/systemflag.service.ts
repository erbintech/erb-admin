import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SystemFlagService {

    constructor(private http: HttpClient) { }

    async getSystemFlags(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        //let parameter=JSON.parse(JSON.stringify({ "nameList": nameList, "valueList": valueList }));
        return await this.http.post(environment.apiUrl + "/api/admin/systemflags/getAdminSystemFlag", {}, { headers: reqHeader })
            .toPromise() as any;
    }

    async saveSystemFlags(nameList: string[], valueList: string[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "nameList": nameList, "valueList": valueList }))
        return await this.http.post(environment.apiUrl + "/api/admin/systemflags/updateSystemFlagByName", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}