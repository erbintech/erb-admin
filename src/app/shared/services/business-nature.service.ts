import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BusinessNatureService {

    constructor(private http: HttpClient) { }

    async getBusinessNature(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/businessNature/getBusinessNature", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBusinessNature(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessNature/insertBusinessNature", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBusinessNature(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/businessNature/updateBusinessNature", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveBusinessNature(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/businessNature/activeInactiveBusinessNature", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}