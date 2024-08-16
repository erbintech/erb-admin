import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserPages } from '../models/users/userPages';

@Injectable({
    providedIn: 'root'
})
export class UserPagesService {

    constructor(private http: HttpClient) { }

    async getPages(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/userPages/getPages", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getUserPages(userId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "userId": userId }));
        return await this.http.post(environment.apiUrl + "/api/admin/userPages/getUserPages", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUserPages(userId: number, userPages: UserPages[], token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "userId": userId, "userPages": userPages }));
        return await this.http.post(environment.apiUrl + "/api/admin/userPages/insertUserPages", parameter, { headers: reqHeader })
            .toPromise() as any
    }


}