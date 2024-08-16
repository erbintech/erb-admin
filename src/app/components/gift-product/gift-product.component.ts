import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';
import { GiftProduct } from 'src/app/shared/models/gift-product';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { GiftProductService } from 'src/app/shared/services/gift-product.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-gift-product',
  templateUrl: './gift-product.component.html',
  styleUrls: ['./gift-product.component.scss']
})
export class GiftProductComponent implements OnInit {
  private token: string
  public title: string;
  public giftProducts: GiftProduct[] = new Array<GiftProduct>();
  public giftProduct:any = new GiftProduct();
  public displayColumns = ['id', 'imageUrl', 'name', 'description', 'coin', 'duration', 'status', 'createdDate', 'action']
  private selectedGiftProduct = [];
  private isShowParentSelection: boolean = true;
  public imageUrl: string
  public user: Users = new Users();
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
  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;


  constructor(
    private modalService: NgbModal,
    private giftProductService: GiftProductService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private paginationService: PaginationService,
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'giftProduct');
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

  giftForm = new FormGroup({
    'imageUrl': new FormControl('', Validators.required),
    'name': new FormControl('', Validators.required),
    'description': new FormControl(''),
    'coin': new FormControl('', Validators.required),
    'duration': new FormControl(''),
  })

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getGiftProduct();
    }
  }

  public async getGiftProduct() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.giftProductService.getProducts(this.startIndex, this.fetchRecord, searchString, this.token);
      if (res && res.status == 200) {
        this.giftProducts = res.recordList;

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

  public async modalOpen(basicmodal: any) {
    this.giftForm.reset();
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
    this.title = "Insert Gift Product";
    this.giftProduct = new GiftProduct();
    this.isShowParentSelection = true;
    this.selectedGiftProduct = this.giftProducts;
    this.isReadonly = false;
  }

  public editDialog(element, basicmodal) {
    this.title = "Edit Gift Products"
    this.giftProduct = new GiftProduct();
    this.giftProduct = element;
    this.giftForm.setValue({
      "imageUrl": this.giftProduct.imageUrl,
      "name": this.giftProduct.name,
      "description": this.giftProduct.description ? this.giftProduct.description : null,
      "coin": this.giftProduct.coin,
      "duration": this.giftProduct.duration ? this.giftProduct.duration : null,
    })
    this.isReadonly = false;
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
    this.selectedGiftProduct = this.giftProducts.filter(c => c.id != element.id);
  }

  public viewDetail(element, basicmodal) {
    this.title = "View Product Details"
    this.giftForm.reset();
    this.giftProduct = new GiftProduct();
    this.giftProduct = element;
    this.isReadonly = true;
    this.giftForm.setValue({
      "imageUrl": this.giftProduct.imageUrl,
      "name": this.giftProduct.name,
      "description": this.giftProduct.description ? this.giftProduct.description : null,
      "coin": this.giftProduct.coin,
      "duration": this.giftProduct.duration ? this.giftProduct.duration : null,
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

  public async insertGiftProduct() {
    try {
      if (this.giftForm.valid) {
        this.spinnerService.show();
        let id = this.giftProduct.id ? this.giftProduct.id : null;
        this.giftProduct = this.giftForm.value;
        this.giftProduct.id = id;
        this.giftProduct.description = this.giftProduct.description ? this.giftProduct.description : null;
        this.giftProduct.duration = this.giftProduct.duration ? this.giftProduct.duration : null;
        if (this.giftProduct.imageUrl && !this.giftProduct.imageUrl.includes("https:")) {
          let giftImage = this.giftProduct.imageUrl.split(',')[1];
          this.giftProduct.imageUrl = giftImage
        }
        let res = await this.giftProductService.inserUpdateProducts(this.giftProduct, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getGiftProduct();
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.giftForm.controls).forEach(key => {
          this.giftForm.controls[key].markAsTouched();
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

  public changeStatus(giftProduct: GiftProduct) {
    let active = giftProduct.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't " + active + " this Product",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.giftProductService.activeInactiveProducts(giftProduct.id, giftProduct.isActive, this.token);
          if (res && res.status == 200) {
            this.getGiftProduct();
            Swal.fire(
              active,
              'Successfully ' + active + ' Product',
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
        giftProduct.isActive = !giftProduct.isActive
      }
    })
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.swal2-container');
      modalContent.classList.remove('dark-only-modal')
    }
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        this.giftForm.get("imageUrl").patchValue(image)
      }

    }
  }

  public removeImage() {
    this.imageUrl = null;
  }

  public closeDialog() {
    this.modalService.dismissAll();
  }

  public clearSearch() {
    this.searchString = null;
    this.getGiftProduct();
  }

  public async downloadCsv() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.giftProductService.getProducts(null, null, searchString, this.token);
      let product = [];
      if (res && res.status == 200) {
        product = res.recordList;
        if (product && product.length > 0) {
          for (let index = 0; index < product.length; index++) {
            product[index].code = product[index].permanentCode ? product[index].permanentCode : product[index].temporaryCode

          }
        }
      }
      AppComponent.text = "Generate CSV";
      this.downloadFile(product);
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.toastrService.error(error);
    }
  }

  private downloadFile(data) {
    let csvData = this.ConvertToCSV(data, ['Name', 'Description', 'Coin', 'Duration', 'Status']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    let fileName = 'PRODUCT_export_' + new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " " + new Date().getTime();
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
      let status = array[j].isActive ? 'Active' : 'InActive';
      line += '\n' + (j + 1) + ',' + array[j].name + ',' + array[j].description + ',' + array[j].coin + ',' + array[j].duration + ',' + status

    }
    str += line + '\r\n';
    return str;
  }

}