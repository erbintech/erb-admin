import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VisitingCardService {

    constructor(private http: HttpClient) { }

    async getAllRoles(startIndex: number, fetchRecords: number,token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/roles/getAllRoles", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getVisitingCards(startIndex: number, fetchRecords: number, roleIds= [],  token: string ): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords , "roleIds": roleIds}))
        return await this.http.post(environment.apiUrl + "/api/admin/visitingCards/getVisitingCards", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertVisitingCard(template: string, roleIds: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "template": template, "roleIds": roleIds }));
        return await this.http.post(environment.apiUrl + "/api/admin/visitingCards/insertVisitingCard", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateVisitingCard(id: number, template: string, roleIds: any,location:string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "template": template, "roleIds": roleIds,"location":location }));
        return await this.http.post(environment.apiUrl + "/api/admin/visitingCards/updateVisitingCard", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInactiveVisitingCard(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/visitingCards/activeInactiveVisitingCard", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}