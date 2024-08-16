import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { Cities } from 'src/app/shared/models/cities';
import { Dsa } from 'src/app/shared/models/dsa';
import { Partners } from 'src/app/shared/models/partner';
import { Users } from 'src/app/shared/models/users/user';
import { BankService } from 'src/app/shared/services/bank.service';
import { DsaService } from 'src/app/shared/services/dsa.service';

@Component({
  selector: 'app-connector-add',
  templateUrl: './connector-add.component.html',
  styleUrls: ['./connector-add.component.scss']
})
export class ConnectorAddComponent implements OnInit {
  public user: Users = new Users();
  public title: string;
  public url: string;
  public picType: string;
  public modal: any
  private alertMessage: string;
  public dsas: Dsa[] = new Array<Dsa>();
  public dsa:any = new Dsa();
  public token: string;
  public isAlert: boolean;
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public alertType: string;
  public searchString: string;
  public selectedCity = [];
  public selectedStatus: string;
  public professions = [];
  public cities: Cities[] = new Array<Cities>();
  public city = new Cities();
  public selectedDsa = [];
  public partners: Partners[] = new Array<Partners>();
  public partner = new Partners();
  public paramid: any;
  public banks: Bank[] = new Array<Bank>();

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private dsaService: DsaService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private bankService: BankService,
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.connectorform.patchValue({ gender: 'Male', jobType: 'FullTime' })
    await this.getBanks();

    this.paramid = this.actRoute.snapshot.paramMap.get('id');
    let partnerId = this.paramid;
    this.paramid = partnerId;
    if (partnerId) {
      await this.getPartnerDetailByPartnerId();
    }

  }

  connectorform = new FormGroup({
    "profilePicUrl": new FormControl(null),
    "fullName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
    "contactNo": new FormControl('', [Validators.required,Validators.minLength(10)]),
    "gender": new FormControl('', Validators.required),
    "aadhaarCardNo": new FormControl(null, [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]),
    "panCardNo": new FormControl(null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    "label": new FormControl('', Validators.required),
    "addressLine1": new FormControl('', Validators.required),
    "addressLine2": new FormControl(''),
    "pincode": new FormControl('', Validators.required),
    "cityId": new FormControl(null, Validators.required),
    "districtName": new FormControl('', Validators.required),
    "state": new FormControl('', Validators.required),
    "commitment": new FormControl('', Validators.required),
    "accountHolderName": new FormControl(''),
    "accountNo": new FormControl(null),
    "ifscCode": new FormControl(''),
    "bankId": new FormControl(''),
    "jobType": new FormControl('', Validators.required)
  });


  public async onKeyUpEvent(event: any, isChagneCityId) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChagneCityId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCityByPincode(n, isChangeCityId) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        this.cities = res.recordList;
        if (this.cities && this.cities.length > 0) {
          this.connectorform.get("districtName").setValue(this.cities[0].districtName)
          this.connectorform.get("state").setValue(this.cities[0].stateName)
          if (isChangeCityId)
            this.connectorform.get("cityId").setValue(this.cities[0].id)
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
      this.toastrService.error(error)
    }
  }

  public async getBanks() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.bankService.getBanks(this.startIndex, this.fetchRecord, searchString, this.token);
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

  public async getPartnerDetailByPartnerId() {
    try {
      this.paramid = this.actRoute.snapshot.paramMap.get('id');
      let partnerId = this.paramid;
      this.paramid = partnerId;
      let res = await this.dsaService.getPartnerDetailByPartnerId(partnerId, this.token);
      if (res && res.status == 200) {
        this.partners = res.recordList;

        this.url = (this.partners[0].basicDetail.profilePicUrl && this.partners[0].basicDetail.profilePicUrl != "") ? this.partners[0].basicDetail.profilePicUrl : null;
        this.connectorform.get('profilePicUrl').patchValue(this.partners[0].basicDetail.profilePicUrl);

        await this.getCityByPincode(this.partners[0].basicDetail.partnerPincode, false)
        if (this.partners[0].basicDetail.cityId) {
          this.connectorform.get('districtName').setValue(this.cities[0].districtName)
          this.connectorform.get('state').setValue(this.cities[0].stateName)
        }

        this.connectorform.get('fullName').setValue(this.partners[0].basicDetail.fullName)
        this.connectorform.get('contactNo').setValue(this.partners[0].basicDetail.contactNo)
        this.connectorform.get('gender').setValue(this.partners[0].basicDetail.gender)
        this.connectorform.get('aadhaarCardNo').setValue(this.partners[0].basicDetail.aadhaarCardNo.replace(/\s/g, ""))
        this.connectorform.get('panCardNo').setValue(this.partners[0].basicDetail.panCardNo)
        this.connectorform.get('label').setValue(this.partners[0].basicDetail.label)
        this.connectorform.get('addressLine1').setValue(this.partners[0].basicDetail.partnerAddressLine1)
        this.connectorform.get('addressLine2').setValue(this.partners[0].basicDetail?.partnerAddressLine2 ? this.partners[0].basicDetail.partnerAddressLine2 : null)
        this.connectorform.get('pincode').setValue(this.partners[0].basicDetail.partnerPincode)
        this.connectorform.get('cityId').setValue(this.partners[0].basicDetail.cityId)
        this.connectorform.get('commitment').setValue(this.partners[0].basicDetail.commitment)
        this.connectorform.get('bankId').setValue(this.partners[0].partnerBankDetail?.bankId ? this.partners[0].partnerBankDetail.bankId : null)
        this.connectorform.get('accountHolderName').setValue(this.partners[0].partnerBankDetail?.accountHolderName ? this.partners[0].partnerBankDetail.accountHolderName : null)
        this.connectorform.get('accountNo').setValue(this.partners[0].partnerBankDetail?.accountNo ?  this.partners[0].partnerBankDetail.accountNo : null)
        this.connectorform.get('ifscCode').setValue(this.partners[0].partnerBankDetail?.ifscCode ? this.partners[0].partnerBankDetail.ifscCode : null)
        this.connectorform.get('jobType').setValue(this.partners[0].basicDetail.jobType ? this.partners[0].basicDetail.jobType : null)
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
      this.isAlert = true;
      this.alertType = "danger";
      setTimeout(() => {
        this.isAlert = false;
      }, 2000);
    }
  }

  public async insertConnector() {
    try {
      if (this.connectorform.valid) {
        this.spinnerService.show();
        this.paramid = this.actRoute.snapshot.paramMap.get('id');
        this.dsa.id = this.paramid;
        this.paramid = this.dsa.id;
        let currentBadgeId = this.dsa.currentBadgeId;
        if (this.dsa.id) {
          this.dsa = this.connectorform.value;
          this.dsa.currentBadgeId = currentBadgeId;
          this.dsa.partnerId = this.paramid;
          this.paramid = this.dsa.partnerId;
          this.dsa.userId = this.partners[0].basicDetail.userId;
          this.dsa.partnerAddressId = this.partners[0].basicDetail.partnerAddressId;
          this.dsa.accountHolderName = this.connectorform.get('accountHolderName').value ? this.connectorform.get('accountHolderName').value : null;
          this.dsa.accountNo = this.connectorform.get('accountNo').value ? this.connectorform.get('accountNo').value : null;
          this.dsa.ifscCode = this.connectorform.get('ifscCode').value ? this.connectorform.get('ifscCode').value : null;
          this.dsa.bankId= this.connectorform.get('bankId').value ? this.connectorform.get('bankId').value : null;
          this.dsa.addressLine2 = this.connectorform.get('addressLine2').value ? this.connectorform.get('addressLine2').value : null;
          this.dsa.partnerEducationId = this.partners[0].basicDetail.partnerEducationId;
          if (this.dsa.profilePicUrl && !this.dsa.profilePicUrl.includes("https:")) {
            let profile = this.dsa.profilePicUrl.split(',')[1];
            this.dsa.profilePicUrl = profile
          }
          else
            this.dsa.profilePicUrl = this.url
          this.dsa.roleId = 6;
          this.dsa.roleName = "connector";
          this.dsa.partnerBankDetailId = this.partners[0].partnerBankDetail?.partnerBankDetailId ? this.partners[0].partnerBankDetail.partnerBankDetailId : null;
          let res = await this.dsaService.updatePartner(this.dsa, this.token);
          if (res && res.status == 200) {
            this.router.navigate(['/connector']);
          }
        }
        else {
          this.dsa = this.connectorform.value;
          this.dsa.accountHolderName = this.connectorform.get('accountHolderName').value ? this.connectorform.get('accountHolderName').value : null;
          this.dsa.accountNo = this.connectorform.get('accountNo').value ? this.connectorform.get('accountNo').value : null;
          this.dsa.ifscCode = this.connectorform.get('ifscCode').value ? this.connectorform.get('ifscCode').value : null;
          this.dsa.bankId= this.connectorform.get('bankId').value ? this.connectorform.get('bankId').value : null;
          this.dsa.addressLine2 = this.connectorform.get('addressLine2').value ? this.connectorform.get('addressLine2').value : null;
          this.dsa.documents = [];
          if (this.dsa.profilePicUrl) {
            let data = {
              "documentId": 3,
              "fileData": this.dsa.profilePicUrl.split(',')[1],
              "fileName": 'photo',
              "contentType": this.picType
            }
            this.dsa.documents[0] = data;
          }

          this.dsa.roleId = 6;
          this.dsa.roleName = "connector";
          this.dsa.currentBadgeId = 1;
          this.dsa.profilePicUrl = null;
          let res = await this.dsaService.insertPartner(this.dsa, this.token);
          if (res && res.status == 200) {
            this.router.navigate(['/connector']);
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.connectorform.controls).forEach(key => {
          this.connectorform.controls[key].markAsTouched();
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

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        let photoType = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
        this.picType = photoType;
        this.url = image;
        this.connectorform.patchValue({
          profilePicUrl: reader.result
        });
      }
    }
  }

  public removeImage() {
    this.url = null;
  }

  public cancelUser() {
    if (this.dsa.id) {
      this.router.navigate(['/connector', this.dsa.id]);
    } else {
      this.router.navigateByUrl('/connector');
    }
  }

  keyPressAlphanumeric(event) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      // only alphabet a-z A-Z
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

