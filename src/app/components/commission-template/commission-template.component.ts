import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { commissionTemplate } from 'src/app/shared/models/commissionTemplate';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BankService } from 'src/app/shared/services/bank.service';
import { CommissionTemplateService } from 'src/app/shared/services/commission-template.service';
import { CommissionService } from 'src/app/shared/services/commissionType.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ServicesService } from 'src/app/shared/services/services.service';
declare let require;
const Swal = require('sweetalert2')
@Component({
  selector: 'app-commission-template',
  templateUrl: './commission-template.component.html',
  styleUrls: ['./commission-template.component.scss']
})
export class CommissionTemplateComponent implements OnInit {
  private token: string
  private alertMessage: string;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  public title: string;
  public displayColumns = ["id", "name", "Action"];
  public commissionDisplayColumns = ["id", "bankName", "serviceName", "commissionType", "commission", "Action"];
  public viewCommissionTemplateColumns = ["id", "bankName", "serviceName", "commissionType", "commission", "createdDate"];
  public paginate: any;
  public commissionTemplate = new commissionTemplate();
  public commissionTemplates: commissionTemplate[] = new Array<commissionTemplate>();
  public commissionTypes = [];
  public banks = [];
  public services = [];
  public showCommission: number
  public bankGetCommission: number;
  public isShowCommission: boolean;
  public isBankGetCommission: boolean;
  public isCommissionError: boolean;
  public filterBankIds = [];
  public filterServiceIds = [];
  public templates = [];
  public commissionIndex = null;
  public isCommissionTemplateForm: boolean
  public isViewCommissionTemplate: boolean = false;
  public name: string


  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
    private commissionTemplateService: CommissionTemplateService,
    private modalService: NgbModal,
    private commissionService: CommissionService,
    private bankService: BankService,
    private loanservice: ServicesService,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'commissionTemplate');
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
    await this.getCommissionType();
    await this.getBanks();
    await this.getServices();
  }

  commissionTemplateForm = new FormGroup({
    'commissionTypeId': new FormControl(null, Validators.required),
    'commission': new FormControl(null, Validators.required),
    'name': new FormControl('', Validators.required),
    'bankId': new FormControl('', Validators.required),
    'serviceId': new FormControl('', Validators.required),
  });

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getCommissionTemplate();
    }
  }

  public async getCommissionType() {
    try {
      this.spinnerService.show();
      let res = await this.commissionService.getCommissionType(null, null, this.token);
      if (res && res.status == 200) {
        this.commissionTypes = res.recordList;
        if (this.commissionTypes && this.commissionTypes.length > 0) {
          this.commissionTypes.forEach(ele => {
            if (ele.parentId) {
              ele.parentName = this.commissionTypes.find(c => c.id == ele.parentId).name;
            }
          });
        }
        this.commissionTypes = this.commissionTypes.filter(c => c.parentId != null)

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

  public async getCommissionTemplate() {
    try {
      this.spinnerService.show();
      let res = await this.commissionTemplateService.getCommissionTemplate(this.startIndex, this.fetchRecord, this.filterBankIds, this.filterServiceIds, this.token);
      if (res && res.status == 200) {
        this.commissionTemplates = res.recordList;

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

  public async insertUpdateCommissionTemplate() {
    try {
      this.spinnerService.show();
      let data = {
        "name": this.commissionTemplateForm.get("name").value,
        "templates": this.templates
      }
      let res = await this.commissionTemplateService.insertUpdateCommissionTemplate(data, this.token);
      if (res && res.status == 200) {
        await this.getCommissionTemplate();
        this.modalService.dismissAll();
        this.commissionTemplateForm.reset();
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

  public async addCommissionTemplate() {
    try {
      if (this.commissionIndex >= 0 && this.commissionIndex != null) {
        let id = this.templates[this.commissionIndex].id;
        this.templates[this.commissionIndex] = this.commissionTemplateForm.value;
        this.templates[this.commissionIndex].bankName = this.banks.find(c => c.id == this.commissionTemplateForm.get("bankId").value).name;
        this.templates[this.commissionIndex].serviceName = this.services.find(c => c.id == this.commissionTemplateForm.get("serviceId").value).name;
        this.templates[this.commissionIndex].commissiontype = this.commissionTypes.find(c => c.id == this.commissionTemplateForm.get("commissionTypeId").value).name;
        this.templates[this.commissionIndex].id = id;
      } else {
        this.templates.push(this.commissionTemplateForm.value);
        this.templates[this.templates.length - 1].bankName = this.banks.find(c => c.id == this.commissionTemplateForm.get("bankId").value).name
        this.templates[this.templates.length - 1].serviceName = this.services.find(c => c.id == this.commissionTemplateForm.get("serviceId").value).name
        this.templates[this.templates.length - 1].commissiontype = this.commissionTypes.find(c => c.id == this.commissionTemplateForm.get("commissionTypeId").value).name;
      }
      this.templates = [...this.templates];
      let name = this.commissionTemplateForm.get("name").value
      this.commissionTemplateForm.reset();
      this.commissionTemplateForm.get("name").setValue(name)
      this.commissionIndex = null;
      this.showCommission = null;
      this.bankGetCommission = null;
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  public async editCommissionTemplate(ele, i) {
    this.commissionTemplateForm.setValue({
      "commissionTypeId": ele.commissionTypeId,
      "commission": ele.commission,
      "name": ele.name,
      'bankId': ele.bankId,
      'serviceId': ele.serviceId,
    });
    this.commissionIndex = i;
    await this.getBankLoanCommission();
    await this.calculateCommission();
  }

  public resetCommissionTemplate() {
    let name = this.commissionTemplateForm.get("name").value;
    this.commissionTemplateForm.reset();
    this.commissionTemplateForm.get("name").setValue(name)
    this.bankGetCommission = null;
    this.showCommission = null;
    this.commissionIndex = null;
  }

  public getTemplate(ele, basicmodal) {
    this.templates = this.commissionTemplates.find(c => c.name == ele.name).templates
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
    this.isViewCommissionTemplate = true;
    this.isCommissionTemplateForm = false;
    this.title = "View Commission Template"
    this.name = ele.name
  }

  public modalOpen(basicmodal: any) {
    this.isCommissionError = false;
    this.showCommission = null;
    this.bankGetCommission = null
    this.isCommissionTemplateForm = true;
    this.isViewCommissionTemplate = false;
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Commission Template";
    this.commissionTemplate = new commissionTemplate();
    this.commissionTemplateForm.reset();
    this.templates = [];
    this.commissionIndex = null;
  }

  public async editDialog(element: commissionTemplate, basicmodal) {
    this.isCommissionError = false;
    this.showCommission = null;
    this.bankGetCommission = null;
    this.isCommissionTemplateForm = true;
    this.isViewCommissionTemplate = false;
    this.title = "Edit Commission Template"
    this.templates = element.templates;
    this.commissionTemplate = new commissionTemplate();
    this.commissionTemplate = element;
    this.commissionTemplateForm.reset();
    this.commissionTemplateForm.get("name").setValue(element.name)
    await this.getBankLoanCommission();
    await this.calculateCommission();
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }

  }

  public closeDialog() {
    this.modalService.dismissAll();
  }

  public async getBanks() {
    try {
      this.spinnerService.show();
      let res = await this.bankService.getBanks(null, null, null, this.token);
      if (res && res.status == 200) {
        this.banks = res.recordList;
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

  public async getBankLoanCommission() {
    if (this.commissionTemplateForm.get('bankId').value) {
      if (this.commissionTemplateForm.get('serviceId').value) {
        try {
          this.spinnerService.show();
          let bankIds = [];
          let serviceIds = [];
          bankIds.push(this.commissionTemplateForm.get('bankId').value)
          serviceIds.push(this.commissionTemplateForm.get('serviceId').value)
          let res = await this.commissionService.getCommission(null, null, bankIds, serviceIds, this.token);
          if (res && res.status == 200) {
            if (res.recordList && res.recordList.length > 0) {
              this.commissionTemplate.bankLoanCommissionId = res.recordList[0].bankCommissions[0].id;
              this.bankGetCommission = res.recordList[0].bankCommissions[0].commission;
            }
            else {
              Swal.fire({
                type: 'warning',
                text: "Please First Insert commission of " + this.services.find(c => c.id == this.commissionTemplateForm.get('serviceId').value).name + " Service of " + this.banks.find(c => c.id == this.commissionTemplateForm.get('bankId').value).name + " for admin",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  this.bankGetCommission = null
                  this.modalService.dismissAll();
                }
              })
              const modalContent = document.querySelector('.swal2-container');
              sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
            }
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
    }
  }

  public async calculateCommission() {
    if (this.commissionTemplateForm.get('commission').value) {
      if (this.commissionTemplateForm.get('commissionTypeId').value == 2) {
        this.showCommission = (this.commissionTemplateForm.get('commission').value * this.bankGetCommission) / 100
      }
      this.checkCommissionExist();
    }
  }

  public checkCommissionExist() {
    this.isCommissionError = false;
    if (this.commissionTemplateForm.get('commission').value) {
      if (this.commissionTemplateForm.get('commissionTypeId').value == 3) {
        if (this.commissionTemplateForm.get('commission').value > this.bankGetCommission)
          this.isCommissionError = true;
      }
      else if (this.commissionTemplateForm.get('commissionTypeId').value == 2) {
        if (this.showCommission) {
          if (this.showCommission > this.bankGetCommission)
            this.isCommissionError = true;
        }
      }

    }
  }

  public clearFilter() {
    this.filterBankIds = [];
    this.filterServiceIds = [];
    this.setPage(1);
  }
}