import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Banner } from 'src/app/shared/models/banner';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { BannerService } from 'src/app/shared/services/banner.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { ToggleMenuService } from 'src/app/shared/services/togglemenu.service';
import { TrainingService } from 'src/app/shared/services/training.service';
import { UsersService } from 'src/app/shared/services/users.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  public token: string;
  public roles = [];
  public alertMessage: string;
  public title: string;
  public banner = new Banner();
  public banners: Banner[] = new Array<Banner>();
  public dateFrom: Date
  public dateTo: Date
  public bannerForm: FormGroup;
  public isActive: boolean;
  private skip: number = 0;
  private take: number = 12;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  public paginate: any;
  public selectedRoles = [];
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private bannerService: BannerService,
    private router: Router,
    public toastrService: ToastrService,
    private userService: UsersService,
    private trainingService: TrainingService,
    private paginationService: PaginationService,
    public toggleMenuService: ToggleMenuService
  ) {
    this.bannerForm = formBuilder.group({
      'roleId': [null, [Validators.required]],
      'fromDate': [null],
      'toDate': [null],
      'url': [null, [Validators.required]],
    });
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'banner');
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
    await this.getRoles();
    await this.setPage(1);
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getBanner();
    }
  }


  public async getBanner() {
    try {
      this.spinnerService.show();
      this.dateFrom = this.dateFrom ? this.dateFrom : null
      this.dateTo = this.dateTo ? this.dateTo : null
      let res = await this.bannerService.getBanners(this.dateFrom, this.dateTo, this.isActive, this.selectedRoles, this.token, this.startIndex, this.fetchRecord);
      if (res && res.status == 200) {
        this.banners = res.recordList;
        if (this.banners && this.banners.length > 0) {
          for (let index = 0; index < this.banners.length; index++) {
            this.banners[index].roleName = this.roles.find(c => c.id == this.banners[index].roleId).name;
          }
          this.count = res.totalRecords;
          this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
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

  public async getRoles() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getRoles(this.token);
      if (res && res.status == 200) {
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c => c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE" || c.name == "CUSTOMERS")
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

  public modalOpen(basicmodal) {
    this.banner = new Banner();
    this.bannerForm.reset();
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
    this.title = "Insert Banner";
  }

  public editDialog(element, basicmodal) {
    this.title = "Update Banner"
    this.bannerForm.reset();
    this.banner = new Banner();
    this.banner = element;
    this.bannerForm.setValue({
      "roleId": this.banner.roleId,
      "url": this.banner.url,
      "fromDate": this.banner.fromDate ? this.banner.fromDate : null,
      "toDate": this.banner.toDate ? this.banner.toDate : null
    })
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

  public async insertBanner(form) {
    if (form.valid) {
      try {
        let id = this.banner.id ? this.banner.id : null;
        this.banner = this.bannerForm.value;
        this.banner.id = id;
        if (this.banner.url && !this.banner.url.includes("https:")) {
          let bannerImage = this.banner.url.split(',')[1];
          this.banner.url = bannerImage
        }
        let res = await this.bannerService.insertBanner(this.banner, this.token);
        if (res && res.status == 200) {
          await this.getBanner();
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
    else {
      Object.keys(this.bannerForm.controls).forEach(key => {
        this.bannerForm.controls[key].markAsTouched();
      });
    }
  }

  public async selectedImage(e: any) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.bannerForm.get("url").setValue(image)
      }

    }
  }

  public changeStatus(banner: Banner) {
    let active = banner.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this banner",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.bannerService.activeInactiveBanner(banner.id, this.token);
          if (res && res.status == 200) {
            let index = this.banners.findIndex(c => c.id == banner.id);
            this.banners[index].isActive = this.banners[index].isActive
            Swal.fire(
              active,
              'Successfully ' + active + ' Banner',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
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
      else {
        banner.isActive = !banner.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public closeDialog() {
    this.modalService.dismissAll();
  }

  public clearSearch() {
    this.dateFrom = null;
    this.dateTo = null;
    this.selectedRoles = [];
    this.getBanner();
  }

}