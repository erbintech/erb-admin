import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MaritalStautusesService {

    constructor(private http: HttpClient) { }

    async getMaritalStatuses(fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/maritalStatuses/getMaritalStatuses", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertMaritalStatus(status: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "status": status }));
        return await this.http.post(environment.apiUrl + "/api/admin/maritalStatuses/insertMaritalStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateMaritalStatus(id: number, status: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "status": status }));
        return await this.http.post(environment.apiUrl + "/api/admin/maritalStatuses/updateMaritalStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveMaritalStatuses(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/maritalStatuses/activeInactiveMaritalStatus", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}