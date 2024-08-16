import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NewsLetterSubscription } from 'src/app/shared/models/news-letter-subscription';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { NewsLetterSubscriptionService } from 'src/app/shared/services/news-letter-subscription.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

@Component({
  selector: 'app-news-letter-subscription',
  templateUrl: './news-letter-subscription.component.html',
  styleUrls: ['./news-letter-subscription.component.scss']
})
export class NewsLetterSubscriptionComponent implements OnInit {
  private token: string
  private startIndex: number;
  private fetchRecord: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private alertMessage: string;
  public paginate: any;
  private count: number = 0;
  public newsLetterSubscriptions: NewsLetterSubscription[] = new Array<NewsLetterSubscription>();
  public newsLetterSubscription = new NewsLetterSubscription();
  public displayColumns = ['id', 'email', 'createdDate'];
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;


  constructor(
    private newsLetterSubscriptionService: NewsLetterSubscriptionService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'newsLetterSubscription');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this._userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this._userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this._userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this._userPagePermission[ind].deletePermission;
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isReadPermission = (roleId == 1) ? true : false;
      this.isWritePermission = (roleId == 1) ? true : false;
      this.isEditPermission = (roleId == 1) ? true : false;
      this.isDeletePermission = (roleId == 1) ? true : false;
    }
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.setPage(1);
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getNewsLetterSubscription();
    }
  }

  public async getNewsLetterSubscription() {
    try {
      this.spinnerService.show();
      let res = await this.newsLetterSubscriptionService.getNewsLetterSubscription(this.token);
      if (res && res.status == 200) {
        this.newsLetterSubscriptions = res.recordList;

        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);

      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage)
    }
  }

}
