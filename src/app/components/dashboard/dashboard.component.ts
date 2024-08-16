import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public token: string;
  private alertMessage: string;
  public dashboardData: any[] = new Array<any>();
  public template = '<!DOCTYPE html><html lang="en"><body><section style="width:360px;height:190px; background-image: url(https://media.istockphoto.com/vectors/vector-background-with-color-gradation-for-banners-cards-flyers-vector-id1303990927?b=1&k=20&m=1303990927&s=612x612&w=0&h=ckKBBlEadpu-MD2CLBw4FXzZpLf0M1BlKxQksle4QZY=); "><h1 style="text-align: center; color: Indigo; font-weight: bold; text-shadow: 2px 2px 5px red; font-style: italic; font-size: 40px; position: relative; top: 10px; right: 10px">[Company Name]</h1><div style="position: absolute; top: 110px; left: 25px"><P><small>[Owner Name]</small></P><P><small>[address]</small></P><P><small>[Contact]  |  [Email]</small></P></div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0GCroRWMoryQVAO7eo9GQ_VMicP61p-koqX5NJ89ZFyYQIuXZplQNFBtFMDReSjeDGpU&usqp=CAU" alt="" style="width:180px;height:100px; border-style: outset; position: absolute; top: 110px; left: 170px; border-radius: 50%; "> </section></body> </html>'
  public take = 10;
  public pendingApplication = [];
  public disbursedApplication = [];
  public pendingPaginate:any = {}
  public disbursedPaginate:any = {}
  public pendingApplicationColumn = ['id', 'user', 'contact', 'service', 'loanAmount', 'applyDate', 'action'];
  public disbursedApplicationColumns = ['id', 'user', 'service', 'amountRequest', 'amountDisbursed', 'emi', 'bankName', 'applyDate', 'action']
  public top10PerformerColumns = ['id', 'partner', 'subDsa', 'connector', 'employee', 'loanApplication', 'training'];
  public topPerformerColumn = ['id', 'partner', 'contactNo', 'role', 'totalLoanAmount']
  public top10Performer = [];
  public selectedInterval: string;
  public topPerformer = [];
  public performerPaginate:any = {};
  public interval = ['month', 'previousMonth', 'previous6Month', 'year']

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private dashboardService: DashboardService,
    private paginationService: PaginationService,
    private router: Router
  ) { }

  async ngOnInit() {

    this.token = sessionStorage.getItem("SessionToken");
    await this.getDashboardData();
    await this.getPendingApplication(1);
    await this.getDisbursedApplication(1);
    await this.getTop10Performer();
    await this.getTopPerformer(1);
  }


  public async getDashboardData() {
    try {
      this.spinnerService.show();
      let res = await this.dashboardService.getDashboardData(this.token);
      if (res && res.status == 200) {
        this.dashboardData = res.recordList
      }
      this.spinnerService.hide()
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

  public async getPendingApplication(pageNumber) {
    try {
      this.spinnerService.show();
      if (pageNumber > 0) {
        let activePage = pageNumber;
        let startIndex = (this.take * (activePage - 1));
        let fetchRecord = this.take;
        let res = await this.dashboardService.getPendingApplication(startIndex, fetchRecord, this.token);
        if (res && res.status == 200) {
          this.pendingApplication = res.recordList
          this.pendingPaginate = this.paginationService.getPager(res.totalRecords, +activePage, this.take);
        }
        this.spinnerService.hide()
      }
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

  public async getDisbursedApplication(pageNumber) {
    try {
      this.spinnerService.show();
      if (pageNumber > 0) {
        let activePage = pageNumber;
        let startIndex = (this.take * (activePage - 1));
        let fetchRecord = this.take;
        let res = await this.dashboardService.getDisbursedData(startIndex, fetchRecord, this.token);
        if (res && res.status == 200) {
          this.disbursedApplication = res.recordList
          this.disbursedPaginate = this.paginationService.getPager(res.totalRecords, +activePage, this.take);
        }
        this.spinnerService.hide()
      }
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

  public async getTop10Performer() {
    try {
      this.spinnerService.show();
      let res = await this.dashboardService.getTop10Performer(this.token);
      if (res && res.status == 200)
        this.top10Performer = res.recordList
      this.spinnerService.hide()
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

  public getDetail(ele) {
    let name = ele.serviceName
    if (name == "Mortgage/LAP") {
      this.router.navigate(["LAP/view/", ele.id]);
    }
    else {
      let name = ele.serviceName.replace(/\s/g, '-')
      let route = name.toLowerCase() + '/view/' + ele.id;
      this.router.navigate([route]);
    }
  }

  public async getTopPerformer(pageNumber, interval?: string) {
    try {
      this.spinnerService.show();
      if (pageNumber > 0) {
        let activePage = pageNumber;
        let startIndex = (this.take * (activePage - 1));
        let fetchRecord = this.take;
        if (interval) {
          this.selectedInterval = interval
        }
        this.selectedInterval = this.selectedInterval ? this.selectedInterval : 'month'
        let res = await this.dashboardService.getTopPerformer(startIndex, fetchRecord, this.selectedInterval, this.token);
        if (res && res.status == 200) {
          this.topPerformer = res.recordList
          this.performerPaginate = this.paginationService.getPager(res.totalRecords, +activePage, this.take);
        }
        this.spinnerService.hide()
      }
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

  public navigateDetail(ele) {
    let roleName = ele.roleName ? ele.roleName.toLowerCase() : 'dsa'
    let id = ele.partnerId ? ele.partnerId : ele.id
    this.router.navigate([roleName, 'view', id])
  }

  public navigateCustomerDetail(ele) {
    this.router.navigate(["customer/view",ele.customerId])
  }

}