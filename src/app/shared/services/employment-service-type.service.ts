import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmploymentServiceTypeService {

    constructor(private http: HttpClient) { }

    async getEmploymentServiceType(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/employmentServiceType/getEmploymentServiceType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertEmploymentServiceType(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/employmentServiceType/insertEmploymentServiceType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateEmploymentServiceType(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/employmentServiceType/updateEmploymentServiceType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveEmploymentServiceType(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/employmentServiceType/activeInactiveEmploymentServiceType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}