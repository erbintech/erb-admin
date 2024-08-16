import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BadgeService {

    constructor(private http: HttpClient) { }

    async getBadges(startIndex: number, fetchRecords: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords }))
        return await this.http.post(environment.apiUrl + "/api/admin/badges/getBadges", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertBadges(name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/badges/insertBadges", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateBadges(id: number, name: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name }));
        return await this.http.post(environment.apiUrl + "/api/admin/badges/updateBadges", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async activeInActiveBadges(id: number, isActive: boolean, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id, "isActive": isActive }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/badges/activeInActiveBadges", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

}