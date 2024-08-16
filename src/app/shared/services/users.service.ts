import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserPages } from '../models/users/userPages';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    constructor(private http: HttpClient) { }

    async login(email: string, password: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": "Adminpanel" });
        let parameter = JSON.parse(JSON.stringify({ "email": email, "password": password }));
        return await this.http.post(environment.apiUrl + "/api/admin/users/login", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async insertUser(fullName: string, gender: string, email: string, contactNo: string, password: string, profilePicUrl: string, roleId: number, token: string, userPages: UserPages[], designation: string, permissionGroupId: number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "fullName": fullName, "gender": gender, "email": email, "contactNo": contactNo, "password": password, "roleId": roleId, "profilePicUrl": profilePicUrl, "userPages": userPages, "designation": designation, "permissionGroupId": permissionGroupId }));
        return await this.http.post(environment.apiUrl + "/api/admin/users/insertUser", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateUser(id: number, fullName: string, gender: string, email: string, contactNo: string, password: string, profilePicUrl: string, roleId: number, token: string, userPages: UserPages[], designation: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "fullName": fullName, "gender": gender, "email": email, "contactNo": contactNo, "password": password, "profilePicUrl": profilePicUrl, "roleId": roleId, "userPages": userPages, "designation": designation }));
        return await this.http.post(environment.apiUrl + "/api/admin/users/updateUser", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getUser(startIndex: number, fetchRecords: number, searchString: string, roleIds: any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString, "roleIds": roleIds }));
        return await this.http.post(environment.apiUrl + "/api/admin/users/getUser", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getPartner(roleIds: any, token: string, startIndex?: number, fetchRecord?: number): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "roleIds": roleIds, "startIndex": startIndex, "fetchRecord": fetchRecord }));
        return await this.http.post(environment.apiUrl + "/api/admin/partners/getPartnerList", parameter, { headers: reqHeader })
            .toPromise() as any
    }


    async getRM(startIndex: number, fetchRecords: number, searchString: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "searchString": searchString }));
        return await this.http.post(environment.apiUrl + "/api/admin/users/getRM", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async removeRM(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/users/removeUser", parameter, { headers: reqHeader })
            .toPromise() as any;
    }
    async blockUnBlockRM(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/users/blockUnBlockUser", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async getUserScratchCard(startIndex: number, fetchRecords: number, searchString: string, roleId: number, rewardTypeId: number, fromDate:any, toDate:any, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "roleIds": roleId, "searchString": searchString, "rewardTypeId": rewardTypeId, "fromDate": fromDate, "toDate": toDate }));
        return await this.http.post(environment.apiUrl + "/api/admin/scratchCard/getScratchCard", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getCompanyCategory(): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": "Adminpanel" });
        return await this.http.post(environment.apiUrl + "/api/customer/serviceMasterData/getCompanyCategories", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async getAdminCommission(startIndex: number, fetchRecords: number, selectedBank: number, selectedService: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "bankId": selectedBank, "serviceId": selectedService }));
        return await this.http.post(environment.apiUrl + "/api/admin/users/getAdminCommission", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getContactRequest(startIndex: number, fetchRecords: number, status: string, fromDate: Date, toDate: Date, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecords": fetchRecords, "status": status, "fromDate": fromDate, "toDate": toDate }));
        return await this.http.post(environment.apiUrl + "/api/admin/contactRequest/getContactRequest", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async changeStatus(id:number,status:string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id,  "status": status}));
        return await this.http.post(environment.apiUrl + "/api/admin/contactRequest/updateContactRequestStatus", parameter, { headers: reqHeader })
            .toPromise() as any
    }

}