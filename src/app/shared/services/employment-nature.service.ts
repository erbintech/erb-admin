import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmploymentNatureService {

    constructor(private http: HttpClient) { }

    async getEmploymentNature(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/employmentNature/getEmploymentNature", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertEmploymentNature(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/employmentNature/insertEmploymentNature", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateEmploymentNature(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/employmentNature/updateEmploymentNature", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveEmploymentNature(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/employmentNature/activeInactiveEmploymentNature", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}