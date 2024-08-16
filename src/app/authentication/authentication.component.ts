import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserPages } from '../shared/models/users/userPages';
import { PersonalLoanService } from '../shared/services/personalLoan.service';
import { SessionStorageService } from '../shared/services/sessionStorage.service';
import { UserPagesService } from '../shared/services/userPages.service';
import { UsersService } from '../shared/services/users.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthenticationComponent {

  public show: boolean = false;
  public loginForm: FormGroup;
  public errorMessage: any;
  public showLoader: boolean = false;
  //public isRememberMe: boolean = false;

  public isAlert: boolean;

  public alertType: string;//["success","danger","warning"]
  public alertMessage: string;

  public organizationNames =[];
  public token: string;
  public nameOfCompany: string
  public userPagePermission: UserPages[] = new Array<UserPages>();

  constructor(
    // public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UsersService,
    private spinnerService: NgxSpinnerService,
    private sessionStorageService: SessionStorageService,
    private userPagesService: UserPagesService,
    private personalLoanService: PersonalLoanService,
    private toastrService:ToastrService
    // private cookieService: CookieService
  ) {

    let isRememberMe = localStorage.getItem("isRememberMe");
    if (isRememberMe && isRememberMe == "true") {
      let email = localStorage.getItem("email");
      let password = localStorage.getItem("password");
      this.loginForm = this.fb.group({
        email: [email, [Validators, Validators.email]],
        password: [password, Validators],
        isRememberMe: [isRememberMe, Validators.required]
      });
    } else {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        isRememberMe: [false, Validators.required]
      });
    }
  }

  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  public async login() {
    try {
      this.spinnerService.show();
      let isRememberMe = this.loginForm.value['isRememberMe']
      let password = btoa(this.loginForm.value['password']);
      let res = await this.userService.login(this.loginForm.value['email'], password);
      if (res && res.status == 200) {
        let categoryRes = await this.userService.getCompanyCategory();
        if (categoryRes && categoryRes.status == 200) {
          let nameArray = [];
          for (let index = 0; index < categoryRes.recordList.length; index++) {
            let data = {
              companyName: categoryRes.recordList[index].companyName,
              id:categoryRes.recordList[index].id
            }
            nameArray.push(data);
          }
          localStorage.setItem("CompanyCategory",JSON.stringify(nameArray))
          if (res.recordList && res.recordList.length > 0) {
            if (isRememberMe) {
              localStorage.setItem("email", this.loginForm.value['email']);
              localStorage.setItem("password", this.loginForm.value['password']);
              localStorage.setItem("isRememberMe", isRememberMe.toString());
            }
            let credential = res.recordList[0];
            sessionStorage.setItem("Credential", JSON.stringify(credential));
            let sessionToken = res.recordList[0].sessionToken;
            sessionStorage.setItem("SessionToken", sessionToken);
            this.token = sessionToken;
            await this.getUserPagePermission(res.recordList[0].userId);
            await this.getPages();
            if (credential && credential.userRole.roleId != 1) {
              if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0)
                this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
              this.userPagePermission.sort((a, b) => {
                if (a.pageId > b.pageId) {
                  return 1
                } else {
                  return -1
                }
              });
              this.router.navigate(["/" + this.userPagePermission[0].name]);
            }
            else {
              this.router.navigate(["/dashboard"]);
            }
          }
        }
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error?.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error?.error?.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
    this.toastrService.error(this.alertMessage )
    }

    
  }

  private async getPages() {
    try {
      let res = await this.userPagesService.getPages(this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0) {
          sessionStorage.setItem("pageList", JSON.stringify(res.recordList));
        }
      }
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error?.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error?.error?.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  private async getUserPagePermission(userId) {
    try {
      let res = await this.userPagesService.getUserPages(userId, this.token);
      if (res && res.status == 200) {
        if (res.recordList && res.recordList.length > 0) {
          sessionStorage.setItem("PagePermission", JSON.stringify(res.recordList));
        }
      }
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error?.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error?.error?.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

}