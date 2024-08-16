import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserPages } from './models/users/userPages';
import { SessionStorageService } from './services/sessionStorage.service';

@Injectable()
export class AuthGuard implements CanActivate {

    public userPagePermission: UserPages[] = new Array<UserPages>();

    constructor(
        private sessionStorageService: SessionStorageService,
        private myRoute: Router
    ) {
    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0)
            this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
        let credential = JSON.parse(sessionStorage.getItem("Credential")) as any;
        if (credential && credential.userId) {

            let url = state.url.toString().split('/')[1];
            if (credential.userRole.roleId != 1) {
                let ind = this.userPagePermission.findIndex(c => c.name.toLowerCase() == url.toLowerCase())
                if (ind >= 0)
                    return true;
                else {
                    this.myRoute.navigate(["permission-denied"]);
                    return false;
                }
            }
            else {
                return true;
            }
        } else {
            this.myRoute.navigate(["login"]);
            return false;
        }
    }
}