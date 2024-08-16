import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PermissionGroupService {

    constructor(private http: HttpClient) { }

    async getPermissionGroup(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }));;
        return await this.http.post(environment.apiUrl + "/api/admin/permissionGroup/getPermissionGroup", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertPermissionGroup(name: string, pagePermissions: any[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name, "pagePermissions": pagePermissions }));;
        return await this.http.post(environment.apiUrl + "/api/admin/permissionGroup/insertPermissionGroup", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updatePermissionGroup(id: number, name: string, pagePermissions: any[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "pagePermissions": pagePermissions }));;
        return await this.http.post(environment.apiUrl + "/api/admin/permissionGroup/updatePermissionGroup", parameter, { headers: reqHeader })
            .toPromise() as any
    }
}