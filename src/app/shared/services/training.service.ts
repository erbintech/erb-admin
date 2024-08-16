import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Training } from '../models/training';

@Injectable({
    providedIn: 'root'
})
export class TrainingService {

    constructor(private http: HttpClient) { }

    async insertTrainingCategory(name: string, parentId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "name": name, "parentId": parentId }));
        return await this.http.post(environment.apiUrl + "/api/admin/trainingCategory/insertTrainingCategory", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async updateTrainingCategory(id: number, name: string, parentId: number, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "id": id, "name": name, "parentId": parentId }));
        return await this.http.post(environment.apiUrl + "/api/admin/trainingCategory/updateTrainingCategory", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getTrainingCategory(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/trainingCategory/getTrainingCategory", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async removeTrainingCategory(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/trainingCategory/removeTrainingCategory", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async activeInactiveTrainingCategory(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/trainingCategory/activeInactiveTrainingCategory", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async getRoles(token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/roles/getAllRoles", {}, { headers: reqHeader })
            .toPromise() as any
    }

    async insertTraining(training: Training, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/training/insertTraining", training, { headers: reqHeader })
            .toPromise() as any
    }

    async updateTraining(training: Training, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/training/updateTraining", training, { headers: reqHeader })
            .toPromise() as any
    }

    async getTraining(startIndex: number, fetchRecord: number, searchString: string, assignRoleIds: any, categoryIds: any, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecord": fetchRecord, "searchString": searchString, "assignRoleIds": assignRoleIds, "categoryIds": categoryIds }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/training/getTraining", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async removeTraining(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/training/removeTraining", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async activeInactiveTraining(id: number, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "id": id }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/training/activeInactiveTraining", parameter, { headers: reqHeader })
            .toPromise() as any;
    }

    async insertAssignTraining(trainingId:number, assignUserIds: any, trainingStatus: string, token: string): Promise<any> {
        let reqHeader = new HttpHeaders({ "Authorization": token });
        let parameter = JSON.parse(JSON.stringify({ "trainingId": trainingId, "assignUserIds": assignUserIds, "trainingStatus": trainingStatus }))
        return await this.http.post(environment.apiUrl + "/api/admin/training/insertAssignTraining", parameter, { headers: reqHeader })
            .toPromise() as any
    }

    async getTrainingAssingUser(startIndex: number, fetchRecord: number, trainingId: number,roleIds:any, token: string): Promise<any> {
        let parameter = JSON.parse(JSON.stringify({ "startIndex": startIndex, "fetchRecord": fetchRecord, "trainingId": trainingId,"roleIds":roleIds }))
        let reqHeader = new HttpHeaders({ "Authorization": token });
        return await this.http.post(environment.apiUrl + "/api/admin/training/getAssignTrainingUsers", parameter, { headers: reqHeader })
            .toPromise() as any
    }
}