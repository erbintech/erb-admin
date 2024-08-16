import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Training } from '../models/training';

@Injectable({
    providedIn: 'root'
})
export class EmploymentTypeService {

    constructor(private http: HttpClient) { }

    async insertEmploymentType(name: string, parentId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name, "parentId": parentId }));
        return await this.http.post(environment.apiUrl + "/api/admin/employmentType/insertEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateEmploymentType(id: number, name: string, parentId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "parentId": parentId }));
        return await this.http.post(environment.apiUrl + "/api/admin/employmentType/updateEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getEmploymentType(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/employmentType/getEmploymentTypes", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveEmploymentType(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/employmentType/activeInactiveEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async insertServiceEmploymentType(serviceId: number, employmentTypeId: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "serviceId": serviceId, "employmentTypeIds": employmentTypeId }));
        return await this.http.post(environment.apiUrl + "/api/admin/serviceEmploymentTypes/insertServiceEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateServiceEmploymentType(id: number, serviceId: number, employmentTypeId: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "serviceId": serviceId, "employmentTypeId": employmentTypeId }));
        return await this.http.post(environment.apiUrl + "/api/admin/serviceEmploymentTypes/updateServiceEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getServiceEmploymentType(token: string, serviceId?: number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "serviceId": serviceId }));
        return await this.http.post(environment.apiUrl + "/api/admin/serviceEmploymentTypes/getServiceEmploymentTypes", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getServices(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/services/getServices", {}, { headers: reqHeader })
            .toPromise() as any
    }


    async activeInactiveServiceEmploymentType(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/serviceEmploymentTypes/activeInactiveServiceEmploymentType", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}