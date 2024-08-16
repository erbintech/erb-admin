import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { Leads } from 'src/app/shared/models/leads';
import { Services } from 'src/app/shared/models/service';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { EmploymentTypeService } from 'src/app/shared/services/employmentType.service';
import { LeadService } from 'src/app/shared/services/lead.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
declare let require;
const Swal = require('sweetalert2')


@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  public alertMessage: string;
  public token: string;
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public leads: Leads[] = new Array<Leads>();
  public displayColumns = ['id', 'name', 'contactNo', 'aadhaarCardNo', 'panCardNo', 'loanAmount', 'service', 'createdBy', 'leadStatus', 'assignToPartner', 'createdDate', 'action']
  public selectedServices = [];
  public services: Services[] = new Array<Services>();
  public partner = [];
  public partnerId: number;
  public leadId: number;
  public serviceId: number;
  public title: string;
  public leadStatus = [];
  public isChangeStatus: boolean = false;
  public isAssignPartner: boolean = false;
  public isEditLead: boolean = false;
  public statusId: number;
  public selectedLeadStatuses = [];
  public selectedPartner = [];
  public isFlag: boolean = true;

  public userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private leadService: LeadService,
    private spinnerService: NgxSpinnerService,
    private paginationService: PaginationService,
    private toastrService: ToastrService,
    private employmentTypeService: EmploymentTypeService,
    private modalService: NgbModal,
    private router: Router,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this.userPagePermission.findIndex(c => c.name == 'leads');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this.userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this.userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this.userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this.userPagePermission[ind].deletePermission;
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
    await this.getLeadStatus();
    await this.setPage(1);
    await this.getServices();
    await this.getPartner();
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getLeads();
    }
  }

  public async getLeads() {
    try {
      this.spinnerService.show();
      let res = await this.leadService.getLeads(this.startIndex, this.fetchRecord, 
        this.token, this.selectedServices, this.selectedPartner);
      if (res && res.status == 200) {
        this.leads = res.recordList;
        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      if(this.leads.length > 0){
        this.isFlag = true
      } else {
        this.isFlag = false
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

  public clearSearch() {
    this.selectedServices = [];
    this.selectedPartner = [];
    this.getLeads();
  }

  public async getServices() {
    try {
      this.spinnerService.show();
      let res = await this.employmentTypeService.getServices(this.token);
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

  public async getLeadStatus() {
    try {
      this.spinnerService.show();
      let res = await this.leadService.getLeadStatuses(this.token);
      if (res && res.status == 200) {
        this.leadStatus = res.recordList;
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

  public async getPartner() {
    try {
      this.spinnerService.show();
      let res = await this.leadService.getPartnerForLeads(this.token);
      if (res && res.status == 200) {
        this.partner = res.recordList;
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

  public async assignToPartner() {
    try {
      let assignedById = JSON.parse(sessionStorage.getItem("Credential")).userId
      let res = await this.leadService.assignToPartner(this.leadId, this.partnerId, assignedById, this.token)
      if (res && res.status == 200) {
        let index = this.leads.findIndex(c => c.id == this.leadId)
        this.leads[index].partnerName = this.partner[this.partner.findIndex(c => c.id == this.partnerId)].fullName
        this.leads[index].partnerContactNo = this.partner[this.partner.findIndex(c => c.id == this.partnerId)].contactNo
        this.leads[index].assignToPartnerId = this.partnerId
        this.leads[index].statusHistory[0].name = "FollowUp";
        this.toastrService.success("Assign Partner SuccessFully");
        this.modalService.dismissAll();
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

  public modalOpen(lead: Leads, basicmodal, active: string) {
    this.isAssignPartner = false
    this.isEditLead = false;
    this.leadId = lead.id;
    this.serviceId = lead.serviceId;
    this.isChangeStatus = false;
    if (active == 'assignPartner') {
      this.title = "Assign To Partner"

      this.isAssignPartner = true
    }
    if (active == 'changeStatus') {
      this.title = "Change Status";
      this.getLeadStatus();
      let selectedLeadStatus = this.leadStatus;
      if (lead.statusHistory && lead.statusHistory.length > 0) {
        selectedLeadStatus.splice(0, (selectedLeadStatus.findIndex(c => c.id == lead.statusHistory[0].leadStatusId) + 1))
      }
      this.selectedLeadStatuses = selectedLeadStatus
      this.isChangeStatus = true
    }
    if (active == 'editLead') {
      this.title = "Edit Lead"
      this.isEditLead = true;
    }
    // this.modalService.open(basicmodal)
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public async getSelectedStatus() {
    if (this.statusId) {
      let name = this.leadStatus.find(c => c.id == this.statusId).name
      if (name == "CloseWon") {
        if (this.serviceId == 12) {
          this.convertLeadIntoCreditCard(this.leads.find(c => c.id == this.leadId));
        } else {
          this.convertLeadIntoLoan(this.leads.find(c => c.id == this.leadId));
        }
      }
      else {
        try {
          let res = await this.leadService.changeLeadStatus(this.leadId, this.statusId, this.token);
          if (res && res.status == 200) {
            this.leads.find(c => c.id == this.leadId).status = this.leadStatus.find(c => c.id == this.statusId).name;
            this.leads = [...this.leads]
            this.modalService.dismissAll();
            await this.getLeads();
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
    }
  }

  public convertLeadIntoLoan(element: Leads) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Convert Leads into Loans",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Convert it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          element.isActive = element.isActive ? true : false;
          element.isDelete = element.isDelete ? true : false;
          element.label = element.label ? element.label : null
          element.addressLine2 = element.addressLine2 ? element.addressLine2 : null
          element.email = element.email ? element.email : null
          element.aadhaarCardNo = element.aadhaarCardNo ? element.aadhaarCardNo : null
          element.loanPurpose = element.loanPurpose ? element.loanPurpose : null
          element.panCardNo = element.panCardNo ? element.panCardNo : null
          let res = await this.leadService.convertLeadIntoLoan(this.token, element);
          if (res && res.status == 200) {
            element.status = 'Won';
            this.router.navigate(["/customers"]);
            this.spinnerService.hide();
            this.modalService.dismissAll();
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
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public convertLeadIntoCreditCard(element: Leads) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Convert Leads into Credit Card",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Convert it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          element.isActive = element.isActive ? true : false;
          element.isDelete = element.isDelete ? true : false;
          element.label = element.label ? element.label : null
          element.addressLine2 = element.addressLine2 ? element.addressLine2 : null
          element.email = element.email ? element.email : null
          element.aadhaarCardNo = element.aadhaarCardNo ? element.aadhaarCardNo : null
          element.loanPurpose = element.loanPurpose ? element.loanPurpose : null
          element.panCardNo = element.panCardNo ? element.panCardNo : null
          let res = await this.leadService.convertLeadIntoCreditCard(this.token, element);
          if (res && res.status == 200) {
            element.status = 'Won';
            this.router.navigate(["/customers"]);
            this.spinnerService.hide();
            this.modalService.dismissAll();
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
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public closeDialog() {
    this.modalService.dismissAll();
  }

  public navigateAddLead(element?) {
    if (element)
      this.router.navigate(["/leads/edit/", element.id])
    else
      this.router.navigate(["/leads/add"])
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let res = await this.leadService.getLeads(null, null, this.token, this.selectedServices, this.selectedPartner);
      let leads = [];
      if (res && res.status == 200) {
        leads = res.recordList;

      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(leads);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Name', 'ContactNo', 'AadharCard', 'PanCard', 'LoanAmount', 'Service', 'CreatedBy', 'Status', 'Assign Partner', 'createdDate']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'Lead_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let status = array[j].statusHistory && array[j].statusHistory.length > 0 ? array[j].statusHistory[0].name : ''
      let assignPartner = array[j].partnerName ? (array[j].partnerName + '-' + array[j].partnerContactNo) : ''
      line += '\n' + (j + 1) + ',' + array[j].customerFullName + "," + array[j].contactNo + "," + array[j].aadhaarCardNo + ',' + array[j].panCardNo + ',' + array[j].loanAmount + ',' + array[j].serviceName + ',' + (array[j].createdByUser + '-' + array[j].createdByContactNo) + ',' + status + ',' + assignPartner + ',' + createdDate

    }
    str += line + '\r\n';
    return str;
  }
}