import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { Commission } from 'src/app/shared/models/commission';
import { Services } from 'src/app/shared/models/service';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankLoanService } from 'src/app/shared/services/bank-loan.service';
import { BankService } from 'src/app/shared/services/bank.service';
import { CommissionService } from 'src/app/shared/services/commissionType.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicesService } from 'src/app/shared/services/services.service';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {
  public searchString: string;
  public token: string
  public bank: Bank[] = new Array<Bank>();
  public alertMessage: string;
  public services: Services[] = new Array<Services>();
  public commissions: Commission[] = new Array<Commission>();
  public commission = new Commission();
  public commissionForm: FormGroup;
  public paginate: any;
  public partnerPaginate: any = {};
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public bankIds = [];
  public serviceIds = [];
  public displayColumns = ['id', 'bankName', 'action'];
  public commissionColumn = ['id', 'dsaCode', 'name', 'contactNo', 'role', 'commission'];
  public displayCommissionColumns = ['id', 'serviceName', 'commission', 'createdDate', 'action']
  public viewCommissionColumns = ['id', 'serviceName', 'commission', 'createdDate']
  public title: string;
  public partner = [];
  public commissionType: Commission[] = new Array<Commission>();
  public commissionTypeId = new FormControl();
  public isCommissionForm: boolean
  private bankId: number;
  private serviceId: number;
  public isPartnerList: boolean
  public bankLoans = [];
  public bankCommissions = [];
  public commissionIndex = null;
  public isViewCommission: boolean = false;
  public bankName: string

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public disabled: boolean;
  public paramid: any;



  constructor(
    private formBuilder: FormBuilder,
    private bankService: BankService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private router: Router,
    private toastrService: ToastrService,
    private loanservice: ServicesService,
    private commissionService: CommissionService,
    private bankLoanService: BankLoanService,
    private actRoute: ActivatedRoute,

  ) {
    this.commissionForm = formBuilder.group({
      'bankId': [null, [Validators.required]],
      'serviceId': [null, [Validators.required]],
      // 'commissionTypeId': [null, [Validators.required]],
      'commission': [null, [Validators.required, Validators.max(100)]],
    })
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'commission');
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
    await this.getBank();
    await this.getServices();

    await this.getCommissionType();
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getCommission();
    }
  }

  public async getCommission() {
    try {
      this.spinnerService.show();
      let res = await this.commissionService.getCommission(this.startIndex, this.fetchRecord, this.bankIds, null, this.token);
      if (res && res.status == 200) {
        this.commissions = res.recordList;
        // this.commissions.forEach(ele => {
        //   let index = this.bankLoans.findIndex(c => (c.bankId == ele.bankId && c.serviceId == ele.serviceId))
        //   if (index >= 0) {
        //     ele.bankLoanId = this.bankLoans[index].id
        //   }
        // })

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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async getBank() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(null, null, null, this.token);
      if (res && res.status == 200) {
        this.bank = res.recordList;
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.loanservice.getServices(null, null, this.token);
      if (res && res.status == 200) {
        this.services = res.recordList;
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async getBankLoans() {
    try {
      this.spinnerService.show();
      let res = await this.bankLoanService.getBankLoans(null, null, null, null, this.token);
      if (res && res.status == 200) {
        this.bankLoans = res.recordList;
        this.bankLoans.forEach(ele => {
          ele.bankServiceName = ele.bankName + "-" + ele.serviceName
        })
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

  public async insertCommission(form) {
    try {
      if (this.bankCommissions && this.bankCommissions.length > 0) {
        this.spinnerService.show();
        let res = await this.commissionService.insertUpdateBankLoanCommission(this.commissionForm.get('bankId').value, this.bankCommissions, this.token);
        if (res && res.status == 200) {
          this.getCommission();
          this.modalService.dismissAll();
          this.commissionForm.reset();
        }
      }
      else {
        this.toastrService.warning("INsert Atleast One Bank Commission")
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public modalOpen(basicmodal) {
    this.title = "Insert Commission"
    this.commissionForm.reset();
    // this.modalService.open(basicmodal, { size: 'lg' });
    this.modalService.open(basicmodal, { size: 'lg', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.isCommissionForm = true;
    this.isViewCommission = false;
    this.isPartnerList = false;
    this.bankCommissions = [];
    this.commissionIndex = null;
    this.bankName = null;
  }

  public editDialog(ele: Commission, basicmodal) {
    this.isCommissionForm = true;
    this.isViewCommission = false;
    this.isPartnerList = false;
    this.title = "Edit Commission";
    this.commissionForm.reset();
    this.bankCommissions = ele.bankCommissions
    // this.modalService.open(basicmodal, { size: 'lg' });
    this.modalService.open(basicmodal, { size: 'lg', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.commissionForm.get('bankId').setValue(ele.bankId)
    this.bankName = null;
  }

  public async clearSearch() {
    this.bankIds = [];
    this.serviceIds = [];
    await this.getCommission();
  }

  public async getCommissionType() {
    try {
      this.spinnerService.show();
      this.paramid = this.actRoute.snapshot.paramMap.get('id');
      let commissionTypeId = this.paramid;
      this.paramid = commissionTypeId;
      let res = await this.commissionService.getCommissionType(null, null, this.token);
      if (res && res.status == 200) {
        this.commissionType = res.recordList;
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public async getPartnerForCommission(ele?: any, basicmodal?: any, pageNumber?: number, first?: boolean) {
    try {
      this.title = "Partner's Commission"
      let activePage = pageNumber;
      let startIndex = (this.take * (activePage - 1));
      this.fetchRecord = this.take;
      this.partner = [];
      this.isCommissionForm = false;
      this.isPartnerList = true;
      if (ele) {
        this.bankId = ele.bankId;
        this.serviceId = ele.serviceId;
      }
      if (!this.commissionTypeId.value) {
        this.commissionTypeId.setValue(2);

      }

      let res = await this.commissionService.getPartnerCommission(null, startIndex, this.fetchRecord, this.bankId, this.serviceId, this.commissionTypeId.value, null, this.token)
      if (res && res.status == 200) {
        if (res.recordList.length > 0) {
          this.partner = res.recordList;
          if (this.partner && this.partner.length > 0) {
            for (let index = 0; index < this.partner.length; index++) {
              this.partner[index].code = this.partner[index].permanentCode ? this.partner[index].permanentCode : this.partner[index].temporaryCode
            }
          }
          this.partnerPaginate = this.paginationService.getPager(res.totalRecords, activePage, this.take);
        }
        if (first)
          // this.modalService.open(basicmodal, { size: 'lg' });
          this.modalService.open(basicmodal, { size: 'lg', windowClass: 'custom-modal' });
          if (sessionStorage.getItem('dark-mode') == 'dark-only') {
            const modalContent = document.querySelector('.custom-modal .modal-content');
            modalContent.classList.add('dark-only-modal')
          }
          else {
            const modalContent = document.querySelector('.custom-modal .modal-content');
            modalContent.classList.remove('dark-only-modal')
          }
      }
    }
    catch (error) {
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

  public addMoreCommission() {

    if (this.commissionForm.valid) {
      if (this.commissionIndex >= 0 && this.commissionIndex != null) {
        let id = this.bankCommissions[this.commissionIndex].id
        this.bankCommissions[this.commissionIndex] = this.commissionForm.value
        this.bankCommissions[this.commissionIndex].serviceName = this.services.find(c => c.id == this.commissionForm.get("serviceId").value).name
        this.bankCommissions[this.commissionIndex].id = id;
      }
      else {
        this.bankCommissions.push(this.commissionForm.value)
        this.bankCommissions[this.bankCommissions.length - 1].serviceName = this.services.find(c => c.id == this.commissionForm.get("serviceId").value).name
      }
      this.bankCommissions = [...this.bankCommissions]
      let bankId = this.commissionForm.get("bankId").value
      this.commissionForm.reset();
      this.commissionForm.get("bankId").setValue(bankId)
      this.commissionIndex = null;
    }
  }

  public deleteCommission(index) {
    this.bankCommissions.splice(index, 1)
    this.bankCommissions = [...this.bankCommissions]
  }

  public editMoreCommissionDialog(ele, i) {
    this.commissionForm.get('serviceId').setValue(ele.serviceId)
    this.commissionForm.get('commission').setValue(ele.commission)
    this.commissionIndex = i;
  }
  // public resetCommission() {

  // }


  public closeDialog() {
    this.modalService.dismissAll();
  }

  public resetCommission() {
    let bankId = this.commissionForm.get("bankId").value
    this.commissionForm.reset();
    this.commissionForm.get("bankId").setValue(bankId)
    this.commissionIndex = null;
  }

  public getBankCommission(ele, basicmodal) {
    this.bankCommissions = this.commissions.find(c => c.bankId == ele.bankId).bankCommissions
    // this.modalService.open(basicmodal, { size: 'lg' })
    this.modalService.open(basicmodal, { size: 'lg', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.isViewCommission = true;
    this.isCommissionForm = false;
    this.title = "View Bank Commission"
    this.bankName = ele.bankName
  }
}