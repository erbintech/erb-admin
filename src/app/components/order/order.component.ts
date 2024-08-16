import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Order } from 'src/app/shared/models/order';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { OrderService } from 'src/app/shared/services/Order.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  private token: string
  public title: string;
  public orders: Order[] = new Array<Order>();
  public order = new Order();
  public orderStauses: Order[] = new Array<Order>();
  public displayColumns = ['id', 'imageUrl', 'fullName', 'contactNo', 'address', 'productName', 'coin', 'quantity', 'totalCoin', 'orderDate', 'orderStatus', 'action']
  private selectedOrder = [];
  private isShowParentSelection: boolean = true;
  private isAlert: boolean = false;
  private alertType: string;
  private alertMessage: string;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  public paginate: any;
  public searchString: string;
  public isReadonly = true;
  public user: Users = new Users();
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public selectedOrderId: number;
  public selectedStatus = [];
  public selectedRemark: string
  public dateFrom: Date;
  public dateTo: Date;
  public selectedOrderStatus: number = null;
  public selectedOrderStatuses = [];
  public isAllowStatusChange: boolean = false;


  constructor(
    private modalService: NgbModal,
    private orderService: OrderService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    public toggleMenuService: ToggleMenuService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'order');
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
    await this.getOrderStatus();
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getOrder();
    }
  }

  public async getOrder() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let statusIds = this.selectedStatus ? this.selectedStatus : [];
      let res = await this.orderService.getOrders(this.dateFrom, this.dateTo, statusIds, this.startIndex, this.fetchRecord, searchString, this.token);
      if (res && res.status == 200) {
        this.orders = res.recordList;

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

  public async getOrderStatus() {
    try {
      this.spinnerService.show();
      let res = await this.orderService.getOrderStatus(this.token);
      if (res && res.status == 200) {
        this.orderStauses = res.recordList;
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

  public async modalOpen(basicmodal: any, obj: Order) {
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Change Status"
    this.selectedOrderId = obj.id;
    this.selectedOrderStatus = null;
    this.getOrderStatus();
    let selectedOrderStatuses = this.orderStauses;
    if (obj.orderStatus) {
      selectedOrderStatuses.splice(0, selectedOrderStatuses.findIndex(c => c.status == obj.orderStatus))
    }
    this.selectedOrderStatuses = selectedOrderStatuses;
    this.selectedOrderStatus = obj ? selectedOrderStatuses[0].id : null;
    this.isAllowStatusChange = true;
  }

  public async changeStatus(form: NgForm) {
    try {
      if (form.valid) {
        this.spinnerService.show();
        let remark = this.order.remark ? this.order.remark : null
        this.order.remark = remark;
        let res = await this.orderService.changeOrderStatus(this.selectedOrderId, this.selectedOrderStatus, this.order.remark, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getOrder();
        }
        this.spinnerService.hide();
      } else {
        Object.keys(form.controls).forEach(key => {
          form.controls[key].markAsTouched();
        });
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public clearSearch() {
    this.searchString = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedStatus = [];
    this.getOrder();
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let statusIds = this.selectedStatus ? this.selectedStatus : [];
      let res = await this.orderService.getOrders(this.dateFrom, this.dateTo, statusIds, null, null, searchString, this.token);
      let order = [];
      if (res && res.status == 200) {
        order = res.recordList;
        if (order && order.length > 0) {
          for (let index = 0; index < order.length; index++) {
            order[index].code = order[index].permanentCode ? order[index].permanentCode : order[index].temporaryCode

          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(order);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['FullName', 'ContactNo', 'Address', 'ProductName', 'Coin', 'Quantity', 'TotalCoin', 'order Date', 'OrderStatus']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'ORDER_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
    dwldLink.setAttribute("download", fileName + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  private ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    let line = '';

    for (let j = 0; j < array.length; j++) {
      let createdDate = '';
      if (array[j].createdDate) {
        createdDate = new Date(array[j].createdDate).getFullYear() + "-" + ("0" + (new Date(array[j].createdDate).getMonth() + 1)).slice(-2) + "-" + ("0" + (new Date(array[j].createdDate).getDate())).slice(-2);
      }
      line += '\n' + (j + 1) + ',' + array[j].fullName + ',' + array[j].contactNo + ',' + array[j].addressLine1 + '-' + array[j].addressLine2 + ',' + array[j].productName + ',' + array[j].coin + ',' + array[j].quantity + ',' + array[j].totalCoin + ',' + createdDate + ',' + array[j].orderStatus

    }
    str += line + '\r\n';
    return str;
  }

}